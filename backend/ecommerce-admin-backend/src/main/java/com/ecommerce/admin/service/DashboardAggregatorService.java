package com.ecommerce.admin.service;

import com.ecommerce.admin.dto.DashboardSummaryDTO;
import com.ecommerce.admin.repository.SellerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardAggregatorService {

    private final RestTemplate restTemplate;
    private final SellerProfileRepository sellerRepository;

    @Value("${services.analytics.url}") private String analyticsUrl;
    @Value("${services.inventory.url}") private String inventoryUrl;
    @Value("${internal.auth.token}")    private String internalToken;

    public DashboardSummaryDTO aggregate() {
        long totalRevenue = 0, totalOrders = 0, newUsers = 0, lowStock = 0;
        boolean analyticsUp = false, inventoryUp = false;

        // ── Analytics: 30-day summary ──
        try {
            String from = LocalDate.now().minusDays(29).toString();
            String to   = LocalDate.now().toString();
            String url  = analyticsUrl + "/api/analytics/sales/summary?from=" + from + "&to=" + to;
            ResponseEntity<Map> resp = restTemplate.exchange(url, HttpMethod.GET, internalHeaders(), Map.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                Map<?, ?> body = resp.getBody();
                totalRevenue = toLong(body.get("totalRevenue"));
                totalOrders  = toLong(body.get("totalOrders"));
                newUsers     = toLong(body.get("newUsers"));
                analyticsUp  = true;
            }
        } catch (Exception e) { log.warn("Analytics service unreachable: {}", e.getMessage()); }

        // ── Inventory: low-stock count ──
        try {
            String url = inventoryUrl + "/api/inventory/low-stock";
            ResponseEntity<Object[]> resp = restTemplate.exchange(url, HttpMethod.GET, internalHeaders(), Object[].class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                lowStock    = resp.getBody().length;
                inventoryUp = true;
            }
        } catch (Exception e) { log.warn("Inventory service unreachable: {}", e.getMessage()); }

        long totalSellers   = sellerRepository.count();
        long pendingSellers = sellerRepository.findAll().stream().filter(s -> !s.getIsApproved()).count();

        return DashboardSummaryDTO.builder()
                .totalRevenue(totalRevenue).totalOrders(totalOrders).newUsers(newUsers)
                .lowStockCount(lowStock).totalSellers(totalSellers).pendingSellers(pendingSellers)
                .analyticsUp(analyticsUp).inventoryUp(inventoryUp)
                .build();
    }

    private HttpEntity<Void> internalHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.set("X-Internal-Token", internalToken);
        return new HttpEntity<>(h);
    }

    private long toLong(Object val) {
        if (val == null) return 0L;
        if (val instanceof Number n) return n.longValue();
        try { return new BigDecimal(val.toString()).longValue(); } catch (Exception e) { return 0L; }
    }
}
