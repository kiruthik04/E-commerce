package com.ecommerce.payments.dto;

import com.ecommerce.payments.model.RefundStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RefundDTO {
    private Long id;
    private Long paymentId;
    private BigDecimal amount;
    private String reason;
    private RefundStatus status;
    private LocalDateTime createdAt;
}
