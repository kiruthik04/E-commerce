package com.ecommerce.tracking.repository;

import com.ecommerce.tracking.model.TrackingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrackingRepository extends JpaRepository<TrackingRecord, Long> {
    Optional<TrackingRecord> findByOrderId(Long orderId);
}
