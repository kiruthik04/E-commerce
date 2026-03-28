package com.ecommerce.recommendations.repository;

import com.ecommerce.recommendations.model.UserBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserBehaviorRepository extends JpaRepository<UserBehavior, Long> {

    // Custom query to aggregate global product interactions over a recent time window (Trending)
    @Query("SELECT ub.productId, SUM(ub.weight) as totalWeight FROM UserBehavior ub " +
           "WHERE ub.createdAt >= :since " +
           "GROUP BY ub.productId " +
           "ORDER BY totalWeight DESC " +
           "LIMIT :limit")
    List<Object[]> findTrendingProducts(@Param("since") LocalDateTime since, @Param("limit") int limit);
}
