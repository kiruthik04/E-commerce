package com.ecommerce.analytics.repository;

import com.ecommerce.analytics.model.SalesSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesSnapshotRepository extends JpaRepository<SalesSnapshot, Long> {

    List<SalesSnapshot> findByDateBetweenOrderByDateAsc(LocalDate from, LocalDate to);

    // Aggregate summary across date range
    @Query("SELECT SUM(s.totalOrders), SUM(s.totalRevenue), SUM(s.totalItemsSold), SUM(s.newUsers) " +
           "FROM SalesSnapshot s WHERE s.date BETWEEN :from AND :to")
    Object[] getSummary(@Param("from") LocalDate from, @Param("to") LocalDate to);

    // Top 10 selling products (using PURCHASE events, mapped by productId)
    @Query(value = "SELECT ae.product_id, COUNT(*) as purchase_count, " +
                   "COUNT(*) * 999 as estimated_revenue " + // placeholder revenue; in real app join with order items
                   "FROM analytics_events ae WHERE ae.event_type = 'PURCHASE' " +
                   "AND ae.product_id IS NOT NULL " +
                   "AND ae.created_at BETWEEN :from AND :to " +
                   "GROUP BY ae.product_id ORDER BY purchase_count DESC LIMIT 10",
           nativeQuery = true)
    List<Object[]> findTopSellingProducts(@Param("from") java.time.LocalDateTime from,
                                          @Param("to") java.time.LocalDateTime to);
}
