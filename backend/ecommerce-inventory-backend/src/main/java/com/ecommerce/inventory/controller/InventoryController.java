package com.ecommerce.inventory.controller;

import com.ecommerce.inventory.dto.*;
import com.ecommerce.inventory.service.InventoryService;
import com.ecommerce.inventory.service.StockAlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final StockAlertService stockAlertService;

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryDTO> getInventory(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventory(productId));
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryDTO> updateStock(@PathVariable Long productId,
                                                    @Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(inventoryService.updateStock(productId, request));
    }

    @PostMapping("/reserve")
    public ResponseEntity<InventoryDTO> reserveStock(@Valid @RequestBody ReserveStockRequest request) {
        return ResponseEntity.ok(inventoryService.reserveStock(request));
    }

    @PostMapping("/release")
    public ResponseEntity<InventoryDTO> releaseStock(@Valid @RequestBody ReserveStockRequest request) {
        return ResponseEntity.ok(inventoryService.releaseStock(request));
    }

    @PostMapping("/deduct")
    public ResponseEntity<InventoryDTO> deductStock(@Valid @RequestBody ReserveStockRequest request) {
        return ResponseEntity.ok(inventoryService.deductStock(request));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InventoryDTO>> getLowStock() {
        return ResponseEntity.ok(stockAlertService.getLowStockItems());
    }

    @GetMapping("/{productId}/movements")
    public ResponseEntity<List<StockMovementDTO>> getMovementHistory(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getMovementHistory(productId));
    }
}
