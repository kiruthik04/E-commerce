package com.ecommerce.inventory.repository;

import com.ecommerce.inventory.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductId(Long productId);
    Optional<Inventory> findByProductIdAndVariantId(Long productId, Long variantId);

    // Fetch all records where available qty is at or below the threshold
    @Query("SELECT i FROM Inventory i WHERE i.quantityAvailable <= i.lowStockThreshold")
    List<Inventory> findAllLowStock();
}
