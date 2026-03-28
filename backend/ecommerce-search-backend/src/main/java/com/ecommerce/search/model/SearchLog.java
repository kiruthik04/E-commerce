package com.ecommerce.search.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SearchLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private String query;

    @Builder.Default
    private Integer resultsCount = 0;

    private Long clickedProductId; // null until user clicks a result

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
