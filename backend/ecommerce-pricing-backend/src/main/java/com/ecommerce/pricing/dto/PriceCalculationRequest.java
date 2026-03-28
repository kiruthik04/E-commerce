package com.ecommerce.pricing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PriceCalculationRequest {
    @NotNull
    private BigDecimal basePrice;       // product base price (already after product discount if applicable)
    private String productId;
    private String category;
    private String couponCode;          // optional
    private BigDecimal cartTotal;       // total across all items for cart-level discount
    private List<String> itemCategories;// categories of all items in cart
}
