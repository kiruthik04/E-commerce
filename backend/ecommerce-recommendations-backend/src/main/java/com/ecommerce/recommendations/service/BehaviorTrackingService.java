package com.ecommerce.recommendations.service;

import com.ecommerce.recommendations.model.BehaviorEvent;
import com.ecommerce.recommendations.model.ProductScore;
import com.ecommerce.recommendations.model.UserBehavior;
import com.ecommerce.recommendations.repository.ProductScoreRepository;
import com.ecommerce.recommendations.repository.UserBehaviorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BehaviorTrackingService {

    private final UserBehaviorRepository userBehaviorRepository;
    private final ProductScoreRepository productScoreRepository;

    @Transactional
    public void trackEvent(Long userId, Long productId, BehaviorEvent event) {
        // 1. Log the raw behavior
        UserBehavior behavior = UserBehavior.builder()
                .userId(userId)
                .productId(productId)
                .eventType(event)
                .weight(event.getWeight())
                .build();
        userBehaviorRepository.save(behavior);

        // 2. Upsert the cumulative Product Score for this user
        ProductScore productScore = productScoreRepository.findByUserIdAndProductId(userId, productId)
                .orElse(ProductScore.builder()
                        .userId(userId)
                        .productId(productId)
                        .score(0)
                        .build());

        productScore.setScore(productScore.getScore() + event.getWeight());
        productScoreRepository.save(productScore);
    }
}
