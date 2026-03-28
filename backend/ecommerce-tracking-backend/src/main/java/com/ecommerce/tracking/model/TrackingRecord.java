package com.ecommerce.tracking.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tracking_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Milestone currentStatus = Milestone.ORDER_PLACED;

    private String currentLocation;

    private LocalDateTime estimatedDelivery;

    private String driverName;
    private String driverPhone;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
