package com.ecommerce.pricing.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data @Builder
public class PriceCalculationDTO {
    private BigDecimal basePrice;
    private BigDecimal productDiscountAmount;
    private BigDecimal priceAfterProductDiscount;
    private BigDecimal couponDiscountAmount;
    private BigDecimal priceAfterCoupon;
    private BigDecimal gstAmount;
    private BigDecimal finalPrice;
    private BigDecimal totalSavings;
    private BigDecimal savingsPercent;
    private Boolean freeShipping;
    private String appliedCouponCode;
    private String breakdown;           // human-readable summary
}
