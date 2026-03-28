package com.ecommerce.pricing.service;

import com.ecommerce.pricing.dto.CouponDTO;
import com.ecommerce.pricing.model.Coupon;
import com.ecommerce.pricing.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public List<CouponDTO> getAllActiveCoupons() {
        return couponRepository.findByIsActiveTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public CouponDTO createCoupon(CouponDTO dto) {
        Coupon coupon = Coupon.builder()
                .code(dto.getCode().toUpperCase())
                .type(dto.getType()).value(dto.getValue())
                .minOrderAmount(dto.getMinOrderAmount())
                .maxDiscountAmount(dto.getMaxDiscountAmount())
                .usageLimit(dto.getUsageLimit() != null ? dto.getUsageLimit() : 0)
                .usedCount(0).validFrom(dto.getValidFrom()).validUntil(dto.getValidUntil())
                .isActive(true).build();
        return toDTO(couponRepository.save(coupon));
    }

    @Transactional
    public CouponDTO updateCoupon(Long id, CouponDTO dto) {
        Coupon c = couponRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found: " + id));
        c.setCode(dto.getCode().toUpperCase());
        c.setType(dto.getType()); c.setValue(dto.getValue());
        c.setMinOrderAmount(dto.getMinOrderAmount()); c.setMaxDiscountAmount(dto.getMaxDiscountAmount());
        c.setUsageLimit(dto.getUsageLimit()); c.setValidFrom(dto.getValidFrom()); c.setValidUntil(dto.getValidUntil());
        if (dto.getIsActive() != null) c.setIsActive(dto.getIsActive());
        return toDTO(couponRepository.save(c));
    }

    @Transactional
    public void deactivateCoupon(Long id) {
        Coupon c = couponRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found: " + id));
        c.setIsActive(false);
        couponRepository.save(c);
    }

    /**
     * Validates coupon against the provided cart total.
     * Returns discount amount — does NOT increment usedCount (that happens at order confirmation).
     */
    public BigDecimal validateAndGetDiscount(String code, BigDecimal cartTotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new IllegalArgumentException("Coupon code '" + code + "' not found."));

        if (!coupon.getIsActive())
            throw new IllegalArgumentException("Coupon '" + code + "' is no longer active.");
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom()))
            throw new IllegalArgumentException("Coupon is not yet valid.");
        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil()))
            throw new IllegalArgumentException("Coupon has expired.");
        if (coupon.getUsageLimit() > 0 && coupon.getUsedCount() >= coupon.getUsageLimit())
            throw new IllegalArgumentException("Coupon usage limit reached.");
        if (coupon.getMinOrderAmount() != null && cartTotal.compareTo(coupon.getMinOrderAmount()) < 0)
            throw new IllegalArgumentException(String.format(
                    "Minimum order amount for this coupon is ₹%.0f. Your cart total is ₹%.0f.",
                    coupon.getMinOrderAmount(), cartTotal));

        return switch (coupon.getType()) {
            case PERCENT -> {
                BigDecimal disc = cartTotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100));
                if (coupon.getMaxDiscountAmount() != null && disc.compareTo(coupon.getMaxDiscountAmount()) > 0)
                    disc = coupon.getMaxDiscountAmount();
                yield disc;
            }
            case FLAT -> coupon.getValue().min(cartTotal);
            case FREE_SHIPPING -> BigDecimal.ZERO; // handled via freeShipping flag
        };
    }

    public boolean isFreeShipping(String code) {
        return couponRepository.findByCodeIgnoreCase(code)
                .filter(c -> c.getIsActive() && c.getType().name().equals("FREE_SHIPPING"))
                .isPresent();
    }

    public CouponDTO toDTO(Coupon c) {
        return CouponDTO.builder().id(c.getId()).code(c.getCode()).type(c.getType())
                .value(c.getValue()).minOrderAmount(c.getMinOrderAmount())
                .maxDiscountAmount(c.getMaxDiscountAmount()).usageLimit(c.getUsageLimit())
                .usedCount(c.getUsedCount()).validFrom(c.getValidFrom()).validUntil(c.getValidUntil())
                .isActive(c.getIsActive()).build();
    }
}
