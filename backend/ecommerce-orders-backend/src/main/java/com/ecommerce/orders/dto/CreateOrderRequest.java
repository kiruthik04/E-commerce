package com.ecommerce.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotBlank(message = "Shipping address cannot be empty")
    private String shippingAddress;

    private String paymentId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<CreateOrderItemRequest> items;
}
