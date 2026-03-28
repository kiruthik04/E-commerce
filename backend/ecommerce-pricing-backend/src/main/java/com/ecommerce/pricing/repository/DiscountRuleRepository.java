package com.ecommerce.pricing.repository;

import com.ecommerce.pricing.model.DiscountRule;
import com.ecommerce.pricing.model.RuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiscountRuleRepository extends JpaRepository<DiscountRule, Long> {

    // Active PRODUCT rules for a specific productId
    @Query("SELECT d FROM DiscountRule d WHERE d.isActive = true AND d.type = 'PRODUCT' " +
           "AND d.targetId = :productId " +
           "AND (d.startDate IS NULL OR d.startDate <= :today) " +
           "AND (d.endDate IS NULL OR d.endDate >= :today)")
    List<DiscountRule> findActiveProductRules(@Param("productId") String productId, @Param("today") LocalDate today);

    // Active CATEGORY rules for a given category
    @Query("SELECT d FROM DiscountRule d WHERE d.isActive = true AND d.type = 'CATEGORY' " +
           "AND LOWER(d.targetId) = LOWER(:category) " +
           "AND (d.startDate IS NULL OR d.startDate <= :today) " +
           "AND (d.endDate IS NULL OR d.endDate >= :today)")
    List<DiscountRule> findActiveCategoryRules(@Param("category") String category, @Param("today") LocalDate today);

    // Active CART-level rules
    @Query("SELECT d FROM DiscountRule d WHERE d.isActive = true AND d.type = 'CART' " +
           "AND (d.startDate IS NULL OR d.startDate <= :today) " +
           "AND (d.endDate IS NULL OR d.endDate >= :today)")
    List<DiscountRule> findActiveCartRules(@Param("today") LocalDate today);
}
