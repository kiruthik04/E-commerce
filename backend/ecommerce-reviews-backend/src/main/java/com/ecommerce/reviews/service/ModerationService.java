package com.ecommerce.reviews.service;

import com.ecommerce.reviews.dto.ReviewDTO;
import com.ecommerce.reviews.exception.ResourceNotFoundException;
import com.ecommerce.reviews.model.Review;
import com.ecommerce.reviews.model.ReviewStatus;
import com.ecommerce.reviews.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModerationService {

    private final ReviewRepository reviewRepository;

    public List<ReviewDTO> getPendingReviews() {
        return reviewRepository.findByStatusOrderByCreatedAtAsc(ReviewStatus.PENDING)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO approveReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
        review.setStatus(ReviewStatus.APPROVED);
        return mapToDTO(reviewRepository.save(review));
    }

    @Transactional
    public ReviewDTO rejectReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
        review.setStatus(ReviewStatus.REJECTED);
        return mapToDTO(reviewRepository.save(review));
    }

    private ReviewDTO mapToDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId()).productId(r.getProductId()).userId(r.getUserId())
                .userName(r.getUserName()).rating(r.getRating()).title(r.getTitle())
                .body(r.getBody()).status(r.getStatus()).isVerifiedPurchase(r.isVerifiedPurchase())
                .helpfulCount(r.getHelpfulCount()).createdAt(r.getCreatedAt()).build();
    }
}
