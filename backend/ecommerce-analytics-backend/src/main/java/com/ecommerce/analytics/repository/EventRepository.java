package com.ecommerce.analytics.repository;

import com.ecommerce.analytics.model.AnalyticsEvent;
import com.ecommerce.analytics.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<AnalyticsEvent, Long> {

    // Top viewed products by PRODUCT_VIEW count
    @Query(value = "SELECT product_id, COUNT(*) as view_count FROM analytics_events " +
                   "WHERE event_type = 'PRODUCT_VIEW' AND product_id IS NOT NULL " +
                   "AND created_at BETWEEN :from AND :to " +
                   "GROUP BY product_id ORDER BY view_count DESC LIMIT 10",
           nativeQuery = true)
    List<Object[]> findTopViewedProducts(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // Top search queries extracted from metadata JSON
    @Query(value = "SELECT JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.query')) as query, COUNT(*) as cnt " +
                   "FROM analytics_events " +
                   "WHERE event_type = 'SEARCH' AND metadata IS NOT NULL " +
                   "AND created_at BETWEEN :from AND :to " +
                   "GROUP BY query ORDER BY cnt DESC LIMIT 10",
           nativeQuery = true)
    List<Object[]> findTopSearchQueries(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // New user registrations (PURCHASE events as proxy for active new users)
    @Query(value = "SELECT DATE(created_at) as day, COUNT(DISTINCT user_id) as cnt " +
                   "FROM analytics_events WHERE event_type = 'PURCHASE' " +
                   "AND created_at BETWEEN :from AND :to " +
                   "GROUP BY day ORDER BY day ASC",
           nativeQuery = true)
    List<Object[]> findNewUsersPerDay(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
