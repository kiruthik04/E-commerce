package com.ecommerce.payments.controller;

import com.ecommerce.payments.dto.InitiatePaymentRequest;
import com.ecommerce.payments.dto.PaymentDTO;
import com.ecommerce.payments.dto.RefundDTO;
import com.ecommerce.payments.dto.RefundRequest;
import com.ecommerce.payments.service.PaymentService;
import com.ecommerce.payments.service.RefundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final RefundService refundService;

    private Long extractUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal(); // From JwtAuthenticationFilter
    }

    @PostMapping("/initiate")
    public ResponseEntity<PaymentDTO> initiatePayment(@Valid @RequestBody InitiatePaymentRequest request, 
                                                      Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(paymentService.initiatePayment(userId, request));
    }

    @PostMapping("/confirm")
    public ResponseEntity<PaymentDTO> confirmPayment(@RequestParam String transactionId, 
                                                     Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(paymentService.confirmPayment(userId, transactionId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDTO> getPaymentByOrder(@PathVariable Long orderId, 
                                                        Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(paymentService.getPaymentDetailsByOrder(userId, orderId));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<RefundDTO> requestRefund(@PathVariable Long paymentId, 
                                                   @Valid @RequestBody RefundRequest request, 
                                                   Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(refundService.requestRefund(userId, paymentId, request));
    }
}
