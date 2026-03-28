package com.ecommerce.payments.controller;

import com.ecommerce.payments.dto.PaymentDTO;
import com.ecommerce.payments.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<Page<PaymentDTO>> getAllPayments(Pageable pageable) {
        // Enforced by standard ROLE_ADMIN constraint in SecurityConfig
        return ResponseEntity.ok(paymentService.getAllPaymentsPaginated(pageable));
    }
}
