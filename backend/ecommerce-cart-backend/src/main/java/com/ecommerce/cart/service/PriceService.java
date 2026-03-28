package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.CartSummaryDTO;
import com.ecommerce.cart.model.CartItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PriceService {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.18"); // 18% GST

    public CartSummaryDTO calculateSummary(List<CartItem> items) {
        int totalItems = 0;
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem item : items) {
            totalItems += item.getQuantity();
            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal taxAmount = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        return CartSummaryDTO.builder()
                .totalItems(totalItems)
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .build();
    }
}
