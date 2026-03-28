package com.ecommerce.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales_snapshots",
    uniqueConstraints = @UniqueConstraint(columnNames = "date"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalesSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    @Builder.Default
    private Long totalOrders = 0L;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Long totalItemsSold = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long newUsers = 0L;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
