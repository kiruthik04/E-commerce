package com.ecommerce.recommendations.repository;

import com.ecommerce.recommendations.model.ProductScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductScoreRepository extends JpaRepository<ProductScore, Long> {
    Optional<ProductScore> findByUserIdAndProductId(Long userId, Long productId);
    
    // Get top scored products for a specific user
    List<ProductScore> findTop10ByUserIdOrderByScoreDesc(Long userId);
}
