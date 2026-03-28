package com.ecommerce.orders.dto;

import com.ecommerce.orders.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull
    private OrderStatus newStatus;
}
