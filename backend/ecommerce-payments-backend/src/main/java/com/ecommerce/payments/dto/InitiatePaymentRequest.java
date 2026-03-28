package com.ecommerce.payments.dto;

import com.ecommerce.payments.model.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InitiatePaymentRequest {
    @NotNull
    private Long orderId;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotNull
    private PaymentMethod method;
}
