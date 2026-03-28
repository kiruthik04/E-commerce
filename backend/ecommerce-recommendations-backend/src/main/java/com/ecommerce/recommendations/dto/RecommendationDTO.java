package com.ecommerce.recommendations.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecommendationDTO {
    private Long productId;
    private Integer score;
    private String reason; // e.g., "Because you viewed similar items", "Trending globally"
    // Note: We only return product IDs and context. 
    // The Frontend/Gateway will hydrate this with Catalog data (Name, Price, Image).
}
