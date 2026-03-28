package com.ecommerce.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductVariantDTO {
    private Long id;
    private Long productId;

    @NotBlank(message = "Variant name is required")
    private String variantName;

    @NotBlank(message = "Variant value is required")
    private String variantValue;

    @NotNull(message = "Price modifier is required")
    private BigDecimal priceModifier;

    @NotNull(message = "Stock is required")
    private Integer stock;
}
