package com.ecommerce.admin.service;

import com.ecommerce.admin.dto.SellerDTO;
import com.ecommerce.admin.model.SellerProfile;
import com.ecommerce.admin.repository.SellerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerProfileRepository sellerRepository;

    public List<SellerDTO> getAllSellers() {
        return sellerRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public SellerDTO approveSeller(Long userId) {
        SellerProfile seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Seller with userId " + userId + " not found."));
        seller.setIsApproved(true);
        return toDTO(sellerRepository.save(seller));
    }

    @Transactional
    public SellerDTO createSeller(SellerDTO dto) {
        SellerProfile s = SellerProfile.builder()
                .userId(dto.getUserId()).storeName(dto.getStoreName())
                .gstNumber(dto.getGstNumber()).bankAccount(dto.getBankAccount())
                .isApproved(false).build();
        return toDTO(sellerRepository.save(s));
    }

    private SellerDTO toDTO(SellerProfile s) {
        return SellerDTO.builder().id(s.getId()).userId(s.getUserId())
                .storeName(s.getStoreName()).gstNumber(s.getGstNumber())
                .bankAccount(s.getBankAccount()).isApproved(s.getIsApproved())
                .createdAt(s.getCreatedAt()).build();
    }
}
