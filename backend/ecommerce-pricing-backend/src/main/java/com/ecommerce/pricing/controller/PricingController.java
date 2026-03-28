package com.ecommerce.pricing.controller;

import com.ecommerce.pricing.dto.*;
import com.ecommerce.pricing.service.DiscountService;
import com.ecommerce.pricing.service.PricingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;
    private final DiscountService discountService;

    @PostMapping("/api/pricing/calculate")
    public ResponseEntity<PriceCalculationDTO> calculatePrice(
            @Valid @RequestBody PriceCalculationRequest req) {
        return ResponseEntity.ok(pricingService.calculate(req));
    }

    @GetMapping("/api/discounts/product/{productId}")
    public ResponseEntity<List<DiscountRuleDTO>> getProductDiscounts(@PathVariable String productId) {
        return ResponseEntity.ok(discountService.getActiveProductDiscounts(productId));
    }
}
