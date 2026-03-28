package com.ecommerce.recommendations.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_scores", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"productId", "userId"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
