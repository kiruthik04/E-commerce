package com.ecommerce.reviews.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateReviewRequest {
    @NotNull(message = "Product ID is mandatory")
    private Long productId;

    @NotBlank(message = "Title is mandatory")
    @Size(max = 120, message = "Title must not exceed 120 characters")
    private String title;

    @NotBlank(message = "Review body is mandatory")
    @Size(min = 20, max = 2000, message = "Review body must be between 20 and 2000 characters")
    private String body;

    @NotNull(message = "Rating is mandatory")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;
}
