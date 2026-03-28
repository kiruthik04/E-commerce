package com.ecommerce.recommendations.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_behaviors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBehavior {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long productId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BehaviorEvent eventType;

    @Column(nullable = false)
    private Integer weight;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
