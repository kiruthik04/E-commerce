package com.ecommerce.admin.controller;

import com.ecommerce.admin.dto.SellerDTO;
import com.ecommerce.admin.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sellers")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @GetMapping
    public ResponseEntity<List<SellerDTO>> getAllSellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<SellerDTO> approveSeller(@PathVariable Long userId) {
        return ResponseEntity.ok(sellerService.approveSeller(userId));
    }

    @PostMapping
    public ResponseEntity<SellerDTO> createSeller(@RequestBody SellerDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.createSeller(dto));
    }
}
