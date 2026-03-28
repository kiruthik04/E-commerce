package com.ecommerce.inventory.dto;

import com.ecommerce.inventory.model.ReferenceType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockUpdateRequest {
    @NotNull(message = "Quantity is mandatory")
    private Integer quantity;

    private String warehouseLocation;

    private Integer lowStockThreshold;

    // For audit trail
    private Long referenceId;
    private ReferenceType referenceType;
    private String notes;
}
