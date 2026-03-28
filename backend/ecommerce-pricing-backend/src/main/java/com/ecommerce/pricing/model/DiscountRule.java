package com.ecommerce.pricing.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "discount_rules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DiscountRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleType type; // PRODUCT, CATEGORY, CART

    private String targetId; // productId, category name, or null for CART

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercent;

    private LocalDate startDate;
    private LocalDate endDate;

    @Builder.Default
    private Boolean isActive = true;
}
