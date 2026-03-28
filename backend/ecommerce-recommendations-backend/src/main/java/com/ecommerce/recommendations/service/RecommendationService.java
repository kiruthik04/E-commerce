package com.ecommerce.recommendations.service;

import com.ecommerce.recommendations.dto.RecommendationDTO;
import com.ecommerce.recommendations.model.ProductScore;
import com.ecommerce.recommendations.repository.ProductScoreRepository;
import com.ecommerce.recommendations.repository.UserBehaviorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductScoreRepository productScoreRepository;
    private final UserBehaviorRepository userBehaviorRepository;

    // 1. Personalized Recommendations based on highest cumulative scores
    public List<RecommendationDTO> getPersonalizedRecommendations(Long userId) {
        List<ProductScore> topScores = productScoreRepository.findTop10ByUserIdOrderByScoreDesc(userId);
        
        if (topScores.isEmpty()) {
            return getTrendingProducts(); // Fallback to trending for brand new users
        }

        return topScores.stream().map(score -> RecommendationDTO.builder()
                .productId(score.getProductId())
                .score(score.getScore())
                .reason("Based on your recent activity")
                .build()
        ).collect(Collectors.toList());
    }

    // 2. Trending Products (Globally highest interactions in last 7 days)
    public List<RecommendationDTO> getTrendingProducts() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> trendingData = userBehaviorRepository.findTrendingProducts(sevenDaysAgo, 10);

        return trendingData.stream().map(data -> RecommendationDTO.builder()
                .productId(((Number) data[0]).longValue())
                .score(((Number) data[1]).intValue())
                .reason("Trending this week")
                .build()
        ).collect(Collectors.toList());
    }

    // 3. Similar Products (Mock logic: usually this would query category + tags via Catalog service)
    // For this mock, we just return products near the ID range to simulate category proximity 
    public List<RecommendationDTO> getSimilarProducts(Long productId) {
        return List.of(
                buildSimilarDto(productId + 1),
                buildSimilarDto(productId + 2),
                buildSimilarDto(productId + 3),
                buildSimilarDto(Math.max(1, productId - 1))
        );
    }

    // 4. New Arrivals (Mock logic: simulate descending latest IDs)
    public List<RecommendationDTO> getNewArrivals() {
        return List.of(
                buildBaseDto(1001L, "Just landed"),
                buildBaseDto(1002L, "Just landed"),
                buildBaseDto(1003L, "Just landed")
        );
    }

    private RecommendationDTO buildSimilarDto(Long id) {
        return RecommendationDTO.builder().productId(id).score(0).reason("Similar to item you are viewing").build();
    }
    
    private RecommendationDTO buildBaseDto(Long id, String reason) {
        return RecommendationDTO.builder().productId(id).score(0).reason(reason).build();
    }
}
