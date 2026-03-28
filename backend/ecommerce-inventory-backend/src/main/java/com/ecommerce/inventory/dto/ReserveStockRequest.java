package com.ecommerce.inventory.dto;

import com.ecommerce.inventory.model.ReferenceType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReserveStockRequest {
    @NotNull(message = "Product ID is mandatory")
    private Long productId;

    private Long variantId;

    @NotNull(message = "Quantity is mandatory")
    private Integer quantity;

    private Long referenceId;

    @NotNull(message = "Reference type is mandatory")
    private ReferenceType referenceType;

    private String notes;
}
