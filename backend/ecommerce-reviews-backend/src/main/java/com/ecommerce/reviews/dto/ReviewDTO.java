package com.ecommerce.reviews.dto;

import com.ecommerce.reviews.model.ReviewStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDTO {
    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String title;
    private String body;
    private ReviewStatus status;
    private boolean isVerifiedPurchase;
    private Integer helpfulCount;
    private LocalDateTime createdAt;
}
