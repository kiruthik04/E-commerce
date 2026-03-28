package com.ecommerce.tracking.repository;

import com.ecommerce.tracking.model.DeliveryMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryMilestoneRepository extends JpaRepository<DeliveryMilestone, Long> {
    List<DeliveryMilestone> findByOrderIdOrderByTimestampAsc(Long orderId);
}
