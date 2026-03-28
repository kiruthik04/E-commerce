package com.ecommerce.reviews.repository;

import com.ecommerce.reviews.model.Review;
import com.ecommerce.reviews.model.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Paginated approved reviews for a product
    Page<Review> findByProductIdAndStatus(Long productId, ReviewStatus status, Pageable pageable);

    // One review per user per product enforcement check
    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);

    // Pending reviews for admin moderation queue
    List<Review> findByStatusOrderByCreatedAtAsc(ReviewStatus status);

    // Rating summary aggregation: returns [rating, count] pairs
    @Query("SELECT r.rating, COUNT(r) FROM Review r " +
           "WHERE r.productId = :productId AND r.status = 'APPROVED' " +
           "GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingSummary(@Param("productId") Long productId);

    // Average rating for a product
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId AND r.status = 'APPROVED'")
    Double getAverageRating(@Param("productId") Long productId);

    // Total review count for a product
    long countByProductIdAndStatus(Long productId, ReviewStatus status);
}
