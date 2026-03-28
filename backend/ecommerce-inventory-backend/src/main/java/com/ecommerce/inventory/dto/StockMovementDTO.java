package com.ecommerce.inventory.dto;

import com.ecommerce.inventory.model.MovementType;
import com.ecommerce.inventory.model.ReferenceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StockMovementDTO {
    private Long id;
    private Long productId;
    private MovementType movementType;
    private Integer quantity;
    private Long referenceId;
    private ReferenceType referenceType;
    private String notes;
    private LocalDateTime createdAt;
}
