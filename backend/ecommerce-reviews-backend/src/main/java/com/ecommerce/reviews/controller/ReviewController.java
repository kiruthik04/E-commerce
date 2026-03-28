package com.ecommerce.reviews.controller;

import com.ecommerce.reviews.dto.*;
import com.ecommerce.reviews.service.ModerationService;
import com.ecommerce.reviews.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ModerationService moderationService;

    // ── Customer Endpoints ──

    @PostMapping("/api/reviews")
    public ResponseEntity<ReviewDTO> createReview(
            @Valid @RequestBody CreateReviewRequest req,
            @AuthenticationPrincipal Long userId,
            Authentication auth) {
        // credentials field holds the username String (set in JwtAuthenticationFilter)
        String userName = auth.getCredentials() != null ? auth.getCredentials().toString() : "Anonymous";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(req, userId, userName));
    }

    @GetMapping("/api/reviews/product/{productId}")
    public ResponseEntity<Page<ReviewDTO>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getApprovedReviews(productId, page, size));
    }

    @GetMapping("/api/reviews/product/{productId}/summary")
    public ResponseEntity<RatingSummaryDTO> getRatingSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(productId));
    }

    @PutMapping("/api/reviews/{id}/helpful")
    public ResponseEntity<ReviewDTO> markHelpful(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.markHelpful(id));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id,
                                             @AuthenticationPrincipal Long userId) {
        reviewService.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }

    // ── Admin Endpoints ──

    @GetMapping("/api/admin/reviews/pending")
    public ResponseEntity<List<ReviewDTO>> getPendingReviews() {
        return ResponseEntity.ok(moderationService.getPendingReviews());
    }

    @PutMapping("/api/admin/reviews/{id}/approve")
    public ResponseEntity<ReviewDTO> approveReview(@PathVariable Long id) {
        return ResponseEntity.ok(moderationService.approveReview(id));
    }

    @PutMapping("/api/admin/reviews/{id}/reject")
    public ResponseEntity<ReviewDTO> rejectReview(@PathVariable Long id) {
        return ResponseEntity.ok(moderationService.rejectReview(id));
    }
}
