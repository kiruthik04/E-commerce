package com.ecommerce.payments.service;

import com.ecommerce.payments.dto.PaymentDTO;
import com.ecommerce.payments.dto.RefundDTO;
import com.ecommerce.payments.dto.RefundRequest;
import com.ecommerce.payments.exception.BadRequestException;
import com.ecommerce.payments.model.Payment;
import com.ecommerce.payments.model.PaymentStatus;
import com.ecommerce.payments.model.Refund;
import com.ecommerce.payments.model.RefundStatus;
import com.ecommerce.payments.repository.PaymentRepository;
import com.ecommerce.payments.repository.RefundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRepository refundRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    @Transactional
    public RefundDTO requestRefund(Long userId, Long paymentId, RefundRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BadRequestException("Payment not found"));

        if (!payment.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to payment");
        }

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException("Can only refund successful payments");
        }

        // Very basic validation - real systems check sum of refunds against payment amount
        if (request.getAmount().compareTo(payment.getAmount()) > 0) {
            throw new BadRequestException("Refund amount cannot exceed payment amount");
        }

        Refund refund = Refund.builder()
                .payment(payment)
                .amount(request.getAmount())
                .reason(request.getReason())
                .status(RefundStatus.PENDING)
                .build();

        Refund saved = refundRepository.save(refund);
        
        // Auto process for mock platform - in reality this goes to manual review or gateway
        saved.setStatus(RefundStatus.PROCESSED);
        paymentService.markPaymentAsRefunded(paymentId);
        refundRepository.save(saved);

        return mapToDTO(saved);
    }
    
    public List<RefundDTO> getRefundsForPayment(Long paymentId) {
        return refundRepository.findByPaymentId(paymentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private RefundDTO mapToDTO(Refund refund) {
        return RefundDTO.builder()
                .id(refund.getId())
                .paymentId(refund.getPayment().getId())
                .amount(refund.getAmount())
                .reason(refund.getReason())
                .status(refund.getStatus())
                .createdAt(refund.getCreatedAt())
                .build();
    }
}
