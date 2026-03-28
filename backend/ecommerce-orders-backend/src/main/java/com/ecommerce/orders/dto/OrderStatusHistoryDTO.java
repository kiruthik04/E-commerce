package com.ecommerce.orders.dto;

import com.ecommerce.orders.model.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderStatusHistoryDTO {
    private Long id;
    private OrderStatus previousStatus;
    private OrderStatus newStatus;
    private LocalDateTime changedAt;
    private String changedBy;
}
