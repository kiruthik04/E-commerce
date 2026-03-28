package com.ecommerce.admin.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "seller_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SellerProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private String storeName;

    @Column(length = 20)
    private String gstNumber;

    private String bankAccount;

    @Builder.Default
    private Boolean isApproved = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
