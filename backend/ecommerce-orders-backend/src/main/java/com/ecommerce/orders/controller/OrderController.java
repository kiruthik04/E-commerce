package com.ecommerce.orders.controller;

import com.ecommerce.orders.dto.CreateOrderRequest;
import com.ecommerce.orders.dto.OrderDTO;
import com.ecommerce.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    private Long extractUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal(); // Configured in JwtAuthenticationFilter
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest request, 
                                                Authentication authentication) {
        Long userId = extractUserId(authentication);
        OrderDTO orderDTO = orderService.createOrder(userId, request, authentication.getName());
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getUserOrders(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderDetails(@PathVariable Long id, Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(orderService.getOrderDetails(id, userId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long id, Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(orderService.cancelOrder(id, userId, authentication.getName()));
    }
}
