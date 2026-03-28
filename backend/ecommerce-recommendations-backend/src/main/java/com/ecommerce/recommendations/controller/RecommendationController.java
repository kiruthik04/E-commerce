package com.ecommerce.recommendations.controller;

import com.ecommerce.recommendations.dto.RecommendationDTO;
import com.ecommerce.recommendations.dto.TrackEventRequest;
import com.ecommerce.recommendations.service.BehaviorTrackingService;
import com.ecommerce.recommendations.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final BehaviorTrackingService behaviorTrackingService;

    // Secure via SecurityContext (Requires valid JWT)
    @PostMapping("/track")
    public ResponseEntity<Void> trackBehavior(@AuthenticationPrincipal Long userId,
                                              @Valid @RequestBody TrackEventRequest request) {
        behaviorTrackingService.trackEvent(userId, request.getProductId(), request.getEventType());
        return ResponseEntity.ok().build();
    }

    // Personalized algorithm
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationDTO>> getPersonalized(@PathVariable Long userId) {
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(userId));
    }

    // Public / Shared aggregates Below
    
    @GetMapping("/trending")
    public ResponseEntity<List<RecommendationDTO>> getTrending() {
        return ResponseEntity.ok(recommendationService.getTrendingProducts());
    }

    @GetMapping("/similar/{productId}")
    public ResponseEntity<List<RecommendationDTO>> getSimilar(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationService.getSimilarProducts(productId));
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<RecommendationDTO>> getNewArrivals() {
        return ResponseEntity.ok(recommendationService.getNewArrivals());
    }
}
