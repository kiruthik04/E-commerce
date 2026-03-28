package com.ecommerce.admin.controller;

import com.ecommerce.admin.dto.DashboardSummaryDTO;
import com.ecommerce.admin.service.DashboardAggregatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardAggregatorService aggregatorService;
    private final RestTemplate restTemplate;

    @Value("${services.analytics.url}") private String analyticsUrl;
    @Value("${internal.auth.token}")    private String internalToken;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryDTO> getDashboard() {
        return ResponseEntity.ok(aggregatorService.aggregate());
    }

    @GetMapping("/reports/sales")
    public ResponseEntity<?> proxySalesReport(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().minusDays(29)}") String from,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}") String to) {
        try {
            String url = analyticsUrl + "/api/analytics/sales/daily?from=" + from + "&to=" + to;
            HttpHeaders h = new HttpHeaders();
            h.set("X-Internal-Token", internalToken);
            ResponseEntity<Object> resp = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(h), Object.class);
            return ResponseEntity.ok(resp.getBody());
        } catch (Exception e) {
            return ResponseEntity.ok(new Object[0]); // return empty on failure
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> proxyUsers() {
        // Returns mocked user list — real impl would proxy to User service
        return ResponseEntity.ok(java.util.List.of(
            java.util.Map.of("id", 1, "name", "Alice Sharma", "email", "alice@example.com", "role", "CUSTOMER"),
            java.util.Map.of("id", 2, "name", "Bob Patel",   "email", "bob@example.com",   "role", "CUSTOMER"),
            java.util.Map.of("id", 3, "name", "Carol Singh",  "email", "carol@example.com",  "role", "ADMIN"),
            java.util.Map.of("id", 4, "name", "Deepak Kumar", "email", "deepak@example.com", "role", "SELLER"),
            java.util.Map.of("id", 5, "name", "Eva Nair",     "email", "eva@example.com",    "role", "SELLER")
        ));
    }
}
