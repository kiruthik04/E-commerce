package com.ecommerce.inventory.service;

import com.ecommerce.inventory.dto.InventoryDTO;
import com.ecommerce.inventory.dto.ReserveStockRequest;
import com.ecommerce.inventory.dto.StockMovementDTO;
import com.ecommerce.inventory.dto.StockUpdateRequest;
import com.ecommerce.inventory.exception.InsufficientStockException;
import com.ecommerce.inventory.exception.ResourceNotFoundException;
import com.ecommerce.inventory.model.*;
import com.ecommerce.inventory.repository.InventoryRepository;
import com.ecommerce.inventory.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;

    private Inventory findByProduct(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));
    }

    public InventoryDTO getInventory(Long productId) {
        return mapToDTO(findByProduct(productId));
    }

    @Transactional
    public InventoryDTO updateStock(Long productId, StockUpdateRequest req) {
        Inventory inv = inventoryRepository.findByProductId(productId)
                .orElse(Inventory.builder().productId(productId).build()); // Auto-create if missing

        int previousQty = inv.getQuantityAvailable();
        int newQty = previousQty + req.getQuantity(); // quantity can be negative (adjustment)
        inv.setQuantityAvailable(Math.max(0, newQty));

        if (req.getWarehouseLocation() != null) inv.setWarehouseLocation(req.getWarehouseLocation());
        if (req.getLowStockThreshold() != null) inv.setLowStockThreshold(req.getLowStockThreshold());

        inventoryRepository.save(inv);

        // Audit trail
        MovementType mType = req.getQuantity() >= 0 ? MovementType.STOCK_IN : MovementType.ADJUSTMENT;
        logMovement(productId, mType, Math.abs(req.getQuantity()), req.getReferenceId(), req.getReferenceType(), req.getNotes());
        log.info("Stock updated for product {}: {} → {}", productId, previousQty, inv.getQuantityAvailable());
        return mapToDTO(inv);
    }

    @Transactional
    public InventoryDTO reserveStock(ReserveStockRequest req) {
        Inventory inv = inventoryRepository.findByProductId(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + req.getProductId()));

        if (inv.getQuantityAvailable() < req.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for product " + req.getProductId() +
                    ". Available: " + inv.getQuantityAvailable() + ", Requested: " + req.getQuantity());
        }

        inv.setQuantityAvailable(inv.getQuantityAvailable() - req.getQuantity());
        inv.setQuantityReserved(inv.getQuantityReserved() + req.getQuantity());
        inventoryRepository.save(inv);

        logMovement(req.getProductId(), MovementType.RESERVED, req.getQuantity(),
                req.getReferenceId(), req.getReferenceType(), req.getNotes());
        return mapToDTO(inv);
    }

    @Transactional
    public InventoryDTO releaseStock(ReserveStockRequest req) {
        Inventory inv = findByProduct(req.getProductId());

        int toRelease = Math.min(req.getQuantity(), inv.getQuantityReserved());
        inv.setQuantityReserved(inv.getQuantityReserved() - toRelease);
        inv.setQuantityAvailable(inv.getQuantityAvailable() + toRelease);
        inventoryRepository.save(inv);

        logMovement(req.getProductId(), MovementType.RELEASED, toRelease,
                req.getReferenceId(), req.getReferenceType(), req.getNotes());
        return mapToDTO(inv);
    }

    @Transactional
    public InventoryDTO deductStock(ReserveStockRequest req) {
        Inventory inv = findByProduct(req.getProductId());

        int toDeduct = Math.min(req.getQuantity(), inv.getQuantityReserved());
        inv.setQuantityReserved(inv.getQuantityReserved() - toDeduct);
        inventoryRepository.save(inv);

        logMovement(req.getProductId(), MovementType.STOCK_OUT, toDeduct,
                req.getReferenceId(), req.getReferenceType(), req.getNotes());
        return mapToDTO(inv);
    }

    public List<StockMovementDTO> getMovementHistory(Long productId) {
        return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream().map(this::mapMovement).collect(Collectors.toList());
    }

    private void logMovement(Long productId, MovementType type, Integer qty,
                             Long refId, ReferenceType refType, String notes) {
        stockMovementRepository.save(StockMovement.builder()
                .productId(productId)
                .movementType(type)
                .quantity(qty)
                .referenceId(refId)
                .referenceType(refType)
                .notes(notes)
                .build());
    }

    private InventoryDTO mapToDTO(Inventory inv) {
        return InventoryDTO.builder()
                .id(inv.getId())
                .productId(inv.getProductId())
                .variantId(inv.getVariantId())
                .warehouseLocation(inv.getWarehouseLocation())
                .quantityAvailable(inv.getQuantityAvailable())
                .quantityReserved(inv.getQuantityReserved())
                .lowStockThreshold(inv.getLowStockThreshold())
                .lowStock(inv.isLowStock())
                .updatedAt(inv.getUpdatedAt())
                .build();
    }

    private StockMovementDTO mapMovement(StockMovement m) {
        return StockMovementDTO.builder()
                .id(m.getId())
                .productId(m.getProductId())
                .movementType(m.getMovementType())
                .quantity(m.getQuantity())
                .referenceId(m.getReferenceId())
                .referenceType(m.getReferenceType())
                .notes(m.getNotes())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
