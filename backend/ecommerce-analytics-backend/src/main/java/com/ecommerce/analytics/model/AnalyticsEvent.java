package com.ecommerce.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_events",
    indexes = {
        @Index(name = "idx_event_type", columnList = "eventType"),
        @Index(name = "idx_event_product", columnList = "productId"),
        @Index(name = "idx_event_created", columnList = "createdAt")
    })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AnalyticsEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    private Long userId;
    private Long productId;

    // Stores JSON meta (search query, page URL, etc.)
    @Column(columnDefinition = "JSON")
    private String metadata;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
