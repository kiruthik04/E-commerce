package com.ecommerce.reviews.service;

import com.ecommerce.reviews.dto.CreateReviewRequest;
import com.ecommerce.reviews.dto.RatingSummaryDTO;
import com.ecommerce.reviews.dto.ReviewDTO;
import com.ecommerce.reviews.exception.DuplicateReviewException;
import com.ecommerce.reviews.exception.ResourceNotFoundException;
import com.ecommerce.reviews.model.Review;
import com.ecommerce.reviews.model.ReviewStatus;
import com.ecommerce.reviews.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Transactional
    public ReviewDTO createReview(CreateReviewRequest req, Long userId, String userName) {
        // Enforce one review per user per product
        if (reviewRepository.findByProductIdAndUserId(req.getProductId(), userId).isPresent()) {
            throw new DuplicateReviewException("You have already submitted a review for this product.");
        }

        // In a real system, verifiedPurchase would be checked against the Order Service.
        // Here we mock it as false by default.
        Review review = Review.builder()
                .productId(req.getProductId())
                .userId(userId)
                .userName(userName)
                .rating(req.getRating())
                .title(req.getTitle())
                .body(req.getBody())
                .status(ReviewStatus.PENDING) // All reviews go to moderation first
                .isVerifiedPurchase(false)
                .helpfulCount(0)
                .build();

        return mapToDTO(reviewRepository.save(review));
    }

    public Page<ReviewDTO> getApprovedReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("helpfulCount").descending().and(Sort.by("createdAt").descending()));
        return reviewRepository.findByProductIdAndStatus(productId, ReviewStatus.APPROVED, pageable)
                .map(this::mapToDTO);
    }

    public RatingSummaryDTO getRatingSummary(Long productId) {
        Double avg = reviewRepository.getAverageRating(productId);
        long total = reviewRepository.countByProductIdAndStatus(productId, ReviewStatus.APPROVED);
        List<Object[]> rawBreakdown = reviewRepository.getRatingSummary(productId);

        Map<Integer, Long> breakdown = new HashMap<>();
        // Init all 5 stars to 0
        for (int i = 1; i <= 5; i++) breakdown.put(i, 0L);
        for (Object[] row : rawBreakdown) {
            breakdown.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
        }

        return RatingSummaryDTO.builder()
                .productId(productId)
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .totalReviews(total)
                .breakdown(breakdown)
                .build();
    }

    @Transactional
    public ReviewDTO markHelpful(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        return mapToDTO(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
        if (!review.getUserId().equals(userId)) {
            throw new AccessDeniedException("You can only delete your own reviews.");
        }
        reviewRepository.delete(review);
    }

    private ReviewDTO mapToDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId()).productId(r.getProductId()).userId(r.getUserId())
                .userName(r.getUserName()).rating(r.getRating()).title(r.getTitle())
                .body(r.getBody()).status(r.getStatus()).isVerifiedPurchase(r.isVerifiedPurchase())
                .helpfulCount(r.getHelpfulCount()).createdAt(r.getCreatedAt()).build();
    }
}
