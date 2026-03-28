package com.ecommerce.reviews.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class RatingSummaryDTO {
    private Long productId;
    private Double averageRating;
    private Long totalReviews;
    // Key = star rating (1–5), Value = count of reviews at that rating
    private Map<Integer, Long> breakdown;
}
