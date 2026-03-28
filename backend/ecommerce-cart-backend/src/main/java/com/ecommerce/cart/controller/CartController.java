package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.dto.CartDTO;
import com.ecommerce.cart.dto.CartSummaryDTO;
import com.ecommerce.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    private Long extractUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal(); // Integrated with JwtAuthenticationFilter
    }

    @GetMapping
    public ResponseEntity<CartDTO> getActiveCart(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cartService.getActiveCartDTO(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItemToCart(@Valid @RequestBody AddToCartRequest request, 
                                                 Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cartService.addItemToCart(userId, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateItemQuantity(@PathVariable Long itemId, 
                                                      @RequestParam Integer quantity, 
                                                      Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeItem(@PathVariable Long itemId, Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cartService.removeItem(userId, itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        Long userId = extractUserId(authentication);
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<CartSummaryDTO> checkout(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cartService.checkoutCart(userId));
    }

    @GetMapping("/summary")
    public ResponseEntity<CartSummaryDTO> getSummary(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(cartService.getCartSummary(userId));
    }
}
