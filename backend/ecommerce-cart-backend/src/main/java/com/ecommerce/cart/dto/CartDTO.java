package com.ecommerce.cart.dto;

import com.ecommerce.cart.model.CartStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CartDTO {
    private Long id;
    private Long userId;
    private CartStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> items;
    private CartSummaryDTO summary;
}
