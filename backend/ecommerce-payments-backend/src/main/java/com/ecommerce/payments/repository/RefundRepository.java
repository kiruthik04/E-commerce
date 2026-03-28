package com.ecommerce.payments.repository;

import com.ecommerce.payments.model.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByPaymentId(Long paymentId);
}
