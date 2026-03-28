package com.ecommerce.pricing.service;

import com.ecommerce.pricing.dto.PriceCalculationDTO;
import com.ecommerce.pricing.dto.PriceCalculationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class PricingService {

    private final DiscountService discountService;
    private final CouponService couponService;

    @Value("${pricing.gst.rate:0.18}")
    private BigDecimal gstRate;

    /**
     * Stacking logic:
     * 1. Apply product/category/cart discount rule (best %) → priceAfterProductDiscount
     * 2. Apply coupon on priceAfterProductDiscount
     * 3. Add GST (18%) on discounted price
     */
    public PriceCalculationDTO calculate(PriceCalculationRequest req) {
        BigDecimal base = req.getBasePrice().setScale(2, RoundingMode.HALF_UP);

        // Step 1: Best product-level discount
        BigDecimal productDiscPct = discountService.getBestProductDiscountPercent(req.getProductId(), req.getCategory());
        BigDecimal productDiscAmount = base.multiply(productDiscPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal priceAfterProduct = base.subtract(productDiscAmount);

        // Step 2: Coupon discount (applied after product discount)
        BigDecimal couponDiscAmount = BigDecimal.ZERO;
        boolean freeShipping = false;
        String appliedCode = null;
        BigDecimal cartTotalForCoupon = req.getCartTotal() != null ? req.getCartTotal() : priceAfterProduct;

        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            couponDiscAmount = couponService.validateAndGetDiscount(req.getCouponCode(), cartTotalForCoupon);
            freeShipping = couponService.isFreeShipping(req.getCouponCode());
            appliedCode = req.getCouponCode().toUpperCase();
        }
        BigDecimal priceAfterCoupon = priceAfterProduct.subtract(couponDiscAmount).max(BigDecimal.ZERO);

        // Step 3: GST
        BigDecimal gstAmount = priceAfterCoupon.multiply(gstRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal finalPrice = priceAfterCoupon.add(gstAmount).setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalSavings = productDiscAmount.add(couponDiscAmount).setScale(2, RoundingMode.HALF_UP);
        BigDecimal savingsPct = base.compareTo(BigDecimal.ZERO) > 0
                ? totalSavings.multiply(BigDecimal.valueOf(100)).divide(base, 1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        String breakdown = buildBreakdown(base, productDiscPct, productDiscAmount,
                priceAfterProduct, appliedCode, couponDiscAmount, priceAfterCoupon, gstAmount, finalPrice, freeShipping);

        return PriceCalculationDTO.builder()
                .basePrice(base)
                .productDiscountAmount(productDiscAmount)
                .priceAfterProductDiscount(priceAfterProduct)
                .couponDiscountAmount(couponDiscAmount)
                .priceAfterCoupon(priceAfterCoupon)
                .gstAmount(gstAmount)
                .finalPrice(finalPrice)
                .totalSavings(totalSavings)
                .savingsPercent(savingsPct)
                .freeShipping(freeShipping)
                .appliedCouponCode(appliedCode)
                .breakdown(breakdown)
                .build();
    }

    private String buildBreakdown(BigDecimal base, BigDecimal pct, BigDecimal pAmt,
                                  BigDecimal afterProd, String code, BigDecimal cAmt,
                                  BigDecimal afterCoupon, BigDecimal gst, BigDecimal final_, boolean ship) {
        StringBuilder sb = new StringBuilder();
        sb.append("Base Price: ₹").append(base);
        if (pAmt.compareTo(BigDecimal.ZERO) > 0)
            sb.append(" | Product Discount (").append(pct).append("%): -₹").append(pAmt)
              .append(" → ₹").append(afterProd);
        if (cAmt.compareTo(BigDecimal.ZERO) > 0)
            sb.append(" | Coupon [").append(code).append("]: -₹").append(cAmt)
              .append(" → ₹").append(afterCoupon);
        sb.append(" | GST (18%): +₹").append(gst);
        sb.append(" | Final: ₹").append(final_);
        if (ship) sb.append(" | FREE Shipping applied");
        return sb.toString();
    }
}
