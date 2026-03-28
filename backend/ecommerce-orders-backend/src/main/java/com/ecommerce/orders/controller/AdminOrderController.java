package com.ecommerce.orders.controller;

import com.ecommerce.orders.dto.OrderDTO;
import com.ecommerce.orders.dto.UpdateOrderStatusRequest;
import com.ecommerce.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getAllOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrdersPaginated(pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, 
                                                      @Valid @RequestBody UpdateOrderStatusRequest request, 
                                                      Authentication authentication) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getNewStatus(), authentication.getName()));
    }
}
