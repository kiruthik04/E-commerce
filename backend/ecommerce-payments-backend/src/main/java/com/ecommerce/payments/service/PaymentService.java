package com.ecommerce.payments.service;

import com.ecommerce.payments.dto.InitiatePaymentRequest;
import com.ecommerce.payments.dto.PaymentDTO;
import com.ecommerce.payments.exception.BadRequestException;
import com.ecommerce.payments.exception.ResourceNotFoundException;
import com.ecommerce.payments.model.Payment;
import com.ecommerce.payments.model.PaymentStatus;
import com.ecommerce.payments.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public PaymentDTO initiatePayment(Long userId, InitiatePaymentRequest request) {
        // Validation: one payment per order ideally
        Optional<Payment> existing = paymentRepository.findByOrderId(request.getOrderId());
        if (existing.isPresent() && existing.get().getStatus() == PaymentStatus.SUCCESS) {
            throw new BadRequestException("Payment for order already succeeded");
        }

        Payment payment = Payment.builder()
                .userId(userId)
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(PaymentStatus.PENDING)
                .transactionId(UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase())
                .build();

        Payment saved = paymentRepository.save(payment);
        return mapToDTO(saved);
    }

    @Transactional
    public PaymentDTO confirmPayment(Long userId, String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!payment.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to transaction");
        }

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment is already processed");
        }

        // Simulating Gateway Response Rules
        // Rule: If amount ends in .99, simulate failure. Else success.
        double amountVal = payment.getAmount().doubleValue();
        boolean isSuccess = !(amountVal % 1 == 0.99 || amountVal % 1 > 0.98);

        payment.setStatus(isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        payment.setGatewayResponse("{\"success\": " + isSuccess + ", \"gateway\": \"MOCK_GATEWAY\"}");

        paymentRepository.save(payment);
        return mapToDTO(payment);
    }

    public PaymentDTO getPaymentDetailsByOrder(Long userId, Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order"));

        if (!payment.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to payment details");
        }
        return mapToDTO(payment);
    }

    public Page<PaymentDTO> getAllPaymentsPaginated(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(this::mapToDTO);
    }

    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return mapToDTO(payment);
    }
    
    @Transactional
    public void markPaymentAsRefunded(Long paymentId) {
         Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
         payment.setStatus(PaymentStatus.REFUNDED);
         paymentRepository.save(payment);
    }

    private PaymentDTO mapToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
