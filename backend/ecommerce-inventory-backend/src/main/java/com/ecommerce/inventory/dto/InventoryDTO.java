package com.ecommerce.inventory.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryDTO {
    private Long id;
    private Long productId;
    private Long variantId;
    private String warehouseLocation;
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer lowStockThreshold;
    private boolean lowStock;
    private LocalDateTime updatedAt;
}
