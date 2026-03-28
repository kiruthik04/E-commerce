package com.ecommerce.pricing.controller;

import com.ecommerce.pricing.dto.*;
import com.ecommerce.pricing.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // ── Public ──

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(@Valid @RequestBody ApplyCouponRequest req) {
        BigDecimal discount = couponService.validateAndGetDiscount(req.getCode(), req.getCartTotal());
        boolean freeShip  = couponService.isFreeShipping(req.getCode());
        BigDecimal after  = req.getCartTotal().subtract(discount);
        return ResponseEntity.ok(Map.of(
                "code", req.getCode().toUpperCase(),
                "discountAmount", discount,
                "priceAfterCoupon", after,
                "freeShipping", freeShip
        ));
    }

    // ── Admin ──

    @GetMapping
    public ResponseEntity<List<CouponDTO>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllActiveCoupons());
    }

    @PostMapping
    public ResponseEntity<CouponDTO> createCoupon(@RequestBody CouponDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(couponService.createCoupon(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CouponDTO> updateCoupon(@PathVariable Long id, @RequestBody CouponDTO dto) {
        return ResponseEntity.ok(couponService.updateCoupon(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateCoupon(@PathVariable Long id) {
        couponService.deactivateCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
