package com.ecommerce.search.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Local product index — a denormalized read-model populated from the Catalog service.
 * In production this would be synced via events/Kafka. Here it's seeded via SQL.
 */
@Entity
@Table(name = "search_products",
    indexes = {
        @Index(name = "idx_name", columnList = "name"),
        @Index(name = "idx_category", columnList = "category")
    })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SearchProduct {
    @Id
    private Long id; // matches productId in catalog service

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Integer stockQty = 0;

    private String imageUrl;

    @Builder.Default
    private Boolean isActive = true;
}
