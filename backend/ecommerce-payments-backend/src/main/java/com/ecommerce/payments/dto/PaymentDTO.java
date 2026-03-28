package com.ecommerce.payments.dto;

import com.ecommerce.payments.model.PaymentMethod;
import com.ecommerce.payments.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentDTO {
    private Long id;
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod method;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime createdAt;
}
