package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.dto.CartDTO;
import com.ecommerce.cart.dto.CartItemDTO;
import com.ecommerce.cart.dto.CartSummaryDTO;
import com.ecommerce.cart.exception.ResourceNotFoundException;
import com.ecommerce.cart.model.Cart;
import com.ecommerce.cart.model.CartItem;
import com.ecommerce.cart.model.CartStatus;
import com.ecommerce.cart.repository.CartItemRepository;
import com.ecommerce.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PriceService priceService;

    public Cart getOrCreateActiveCart(Long userId) {
        return cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .status(CartStatus.ACTIVE)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public CartDTO getActiveCartDTO(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO addItemToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateActiveCart(userId);

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductIdAndVariantId(
                cart.getId(), request.getProductId(), request.getVariantId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            // Optionally update price if it changed
            item.setUnitPrice(request.getUnitPrice());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(request.getProductId())
                    .productName(request.getProductName())
                    .productImageUrl(request.getProductImageUrl())
                    .quantity(request.getQuantity())
                    .unitPrice(request.getUnitPrice())
                    .variantId(request.getVariantId())
                    .variantLabel(request.getVariantLabel())
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO updateItemQuantity(Long userId, Long itemId, Integer quantity) {
        Cart cart = getOrCreateActiveCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to active cart");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateActiveCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to active cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapToDTO(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
    }

    @Transactional
    public CartSummaryDTO checkoutCart(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout an empty cart");
        }

        CartSummaryDTO summary = priceService.calculateSummary(cart.getItems());

        cart.setStatus(CartStatus.CHECKED_OUT);
        cartRepository.save(cart);

        return summary;
    }

    public CartSummaryDTO getCartSummary(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        return priceService.calculateSummary(cart.getItems());
    }

    private CartDTO mapToDTO(Cart cart) {
        // Force evaluation of items (lazy init handling if needed)
        List<CartItem> items = cart.getItems() != null ? cart.getItems() : new ArrayList<>();
        
        List<CartItemDTO> itemDTOs = items.stream()
                .map(item -> CartItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .productImageUrl(item.getProductImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .variantId(item.getVariantId())
                        .variantLabel(item.getVariantLabel())
                        .build())
                .collect(Collectors.toList());

        CartSummaryDTO summary = priceService.calculateSummary(items);

        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .status(cart.getStatus())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .items(itemDTOs)
                .summary(summary)
                .build();
    }
}
