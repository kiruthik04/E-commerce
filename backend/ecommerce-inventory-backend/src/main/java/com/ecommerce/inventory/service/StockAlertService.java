package com.ecommerce.inventory.service;

import com.ecommerce.inventory.dto.InventoryDTO;
import com.ecommerce.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockAlertService {

    private final InventoryRepository inventoryRepository;

    public List<InventoryDTO> getLowStockItems() {
        return inventoryRepository.findAllLowStock().stream()
                .map(inv -> InventoryDTO.builder()
                        .id(inv.getId())
                        .productId(inv.getProductId())
                        .variantId(inv.getVariantId())
                        .warehouseLocation(inv.getWarehouseLocation())
                        .quantityAvailable(inv.getQuantityAvailable())
                        .quantityReserved(inv.getQuantityReserved())
                        .lowStockThreshold(inv.getLowStockThreshold())
                        .lowStock(inv.isLowStock())
                        .updatedAt(inv.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
