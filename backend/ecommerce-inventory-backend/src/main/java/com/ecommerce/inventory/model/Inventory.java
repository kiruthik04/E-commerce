package com.ecommerce.inventory.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"productId", "variantId"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    // Nullable — null means the root product (no variant)
    private Long variantId;

    @Column(nullable = false)
    @Builder.Default
    private String warehouseLocation = "MAIN";

    @Column(nullable = false)
    @Builder.Default
    private Integer quantityAvailable = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantityReserved = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer lowStockThreshold = 10;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Derived helper (transient — not persisted)
    @Transient
    public boolean isLowStock() {
        return quantityAvailable <= lowStockThreshold;
    }
}
