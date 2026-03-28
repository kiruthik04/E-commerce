package com.ecommerce.analytics.controller;

import com.ecommerce.analytics.dto.*;
import com.ecommerce.analytics.service.AnalyticsService;
import com.ecommerce.analytics.service.ReportService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ReportService reportService;

    // Seed 30 days of demo data on startup
    @PostConstruct
    public void init() {
        reportService.seedDemoSnapshots();
    }

    // ── Event Tracking (open) ──
    @PostMapping("/event")
    public ResponseEntity<Void> trackEvent(@Valid @RequestBody EventDTO dto) {
        analyticsService.trackEvent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ── Report Endpoints (ADMIN only via SecurityConfig) ──

    @GetMapping("/sales/summary")
    public ResponseEntity<SalesSummaryDTO> getSalesSummary(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().minusDays(30)}") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(reportService.getSalesSummary(from, to));
    }

    @GetMapping("/sales/daily")
    public ResponseEntity<List<RevenueReportDTO>> getDailyRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate f = from != null ? from : LocalDate.now().minusDays(29);
        LocalDate t = to != null ? to : LocalDate.now();
        return ResponseEntity.ok(reportService.getDailyRevenue(f, t));
    }

    @GetMapping("/products/top-selling")
    public ResponseEntity<List<TopProductDTO>> getTopSellingProducts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate f = from != null ? from : LocalDate.now().minusDays(29);
        LocalDate t = to != null ? to : LocalDate.now();
        return ResponseEntity.ok(reportService.getTopSellingProducts(f, t));
    }

    @GetMapping("/products/most-viewed")
    public ResponseEntity<List<TopProductDTO>> getMostViewedProducts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate f = from != null ? from : LocalDate.now().minusDays(29);
        LocalDate t = to != null ? to : LocalDate.now();
        return ResponseEntity.ok(reportService.getMostViewedProducts(f, t));
    }

    @GetMapping("/users/new")
    public ResponseEntity<List<Map<String, Object>>> getNewUsers(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate f = from != null ? from : LocalDate.now().minusDays(29);
        LocalDate t = to != null ? to : LocalDate.now();
        return ResponseEntity.ok(reportService.getNewUsersPerDay(f, t));
    }

    @GetMapping("/search/top-queries")
    public ResponseEntity<List<Map<String, Object>>> getTopSearchQueries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate f = from != null ? from : LocalDate.now().minusDays(29);
        LocalDate t = to != null ? to : LocalDate.now();
        return ResponseEntity.ok(reportService.getTopSearchQueries(f, t));
    }
}
