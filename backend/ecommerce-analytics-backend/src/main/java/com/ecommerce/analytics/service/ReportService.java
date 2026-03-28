package com.ecommerce.analytics.service;

import com.ecommerce.analytics.dto.*;
import com.ecommerce.analytics.model.SalesSnapshot;
import com.ecommerce.analytics.repository.EventRepository;
import com.ecommerce.analytics.repository.SalesSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final SalesSnapshotRepository snapshotRepository;
    private final EventRepository eventRepository;

    // ── Sales Summary ──
    public SalesSummaryDTO getSalesSummary(LocalDate from, LocalDate to) {
        Object[] row = snapshotRepository.getSummary(from, to);
        Long orders = row[0] != null ? ((Number) row[0]).longValue() : 0L;
        BigDecimal revenue = row[1] != null ? ((BigDecimal) row[1]) : BigDecimal.ZERO;
        Long items = row[2] != null ? ((Number) row[2]).longValue() : 0L;
        Long users = row[3] != null ? ((Number) row[3]).longValue() : 0L;
        BigDecimal avg = orders > 0 ? revenue.divide(BigDecimal.valueOf(orders), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        return SalesSummaryDTO.builder()
                .totalOrders(orders).totalRevenue(revenue)
                .totalItemsSold(items).newUsers(users).avgOrderValue(avg).build();
    }

    // ── Daily Revenue Chart ──
    public List<RevenueReportDTO> getDailyRevenue(LocalDate from, LocalDate to) {
        return snapshotRepository.findByDateBetweenOrderByDateAsc(from, to)
                .stream().map(s -> RevenueReportDTO.builder()
                        .date(s.getDate()).revenue(s.getTotalRevenue())
                        .orders(s.getTotalOrders()).itemsSold(s.getTotalItemsSold())
                        .newUsers(s.getNewUsers()).build())
                .collect(Collectors.toList());
    }

    // ── Top Selling Products ──
    public List<TopProductDTO> getTopSellingProducts(LocalDate from, LocalDate to) {
        LocalDateTime dtFrom = from.atStartOfDay();
        LocalDateTime dtTo = to.atTime(LocalTime.MAX);
        return snapshotRepository.findTopSellingProducts(dtFrom, dtTo).stream()
                .map(row -> TopProductDTO.builder()
                        .productId(((Number) row[0]).longValue())
                        .count(((Number) row[1]).longValue())
                        .revenue(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());
    }

    // ── Most Viewed Products ──
    public List<TopProductDTO> getMostViewedProducts(LocalDate from, LocalDate to) {
        LocalDateTime dtFrom = from.atStartOfDay();
        LocalDateTime dtTo = to.atTime(LocalTime.MAX);
        return eventRepository.findTopViewedProducts(dtFrom, dtTo).stream()
                .map(row -> TopProductDTO.builder()
                        .productId(((Number) row[0]).longValue())
                        .count(((Number) row[1]).longValue())
                        .revenue(null)
                        .build())
                .collect(Collectors.toList());
    }

    // ── Top Search Queries ──
    public List<Map<String, Object>> getTopSearchQueries(LocalDate from, LocalDate to) {
        LocalDateTime dtFrom = from.atStartOfDay();
        LocalDateTime dtTo = to.atTime(LocalTime.MAX);
        return eventRepository.findTopSearchQueries(dtFrom, dtTo).stream()
                .map(row -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("query", row[0]);
                    map.put("count", ((Number) row[1]).longValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    // ── New Users Per Day ──
    public List<Map<String, Object>> getNewUsersPerDay(LocalDate from, LocalDate to) {
        LocalDateTime dtFrom = from.atStartOfDay();
        LocalDateTime dtTo = to.atTime(LocalTime.MAX);
        return eventRepository.findNewUsersPerDay(dtFrom, dtTo).stream()
                .map(row -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("date", row[0].toString());
                    map.put("count", ((Number) row[1]).longValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    // ── Seed demo snapshots for last 30 days ──
    @Transactional
    public void seedDemoSnapshots() {
        Random rng = new Random(42);
        LocalDate today = LocalDate.now();
        for (int i = 29; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            if (snapshotRepository.findByDateBetweenOrderByDateAsc(d, d).isEmpty()) {
                long orders = 40 + rng.nextInt(120);
                double avg = 800 + rng.nextDouble() * 2000;
                snapshotRepository.save(SalesSnapshot.builder()
                        .date(d)
                        .totalOrders(orders)
                        .totalRevenue(BigDecimal.valueOf(orders * avg).setScale(2, RoundingMode.HALF_UP))
                        .totalItemsSold(orders + rng.nextInt(50))
                        .newUsers((long)(5 + rng.nextInt(30)))
                        .build());
            }
        }
    }
}
