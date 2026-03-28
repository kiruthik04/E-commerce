package com.ecommerce.pricing.service;

import com.ecommerce.pricing.dto.DiscountRuleDTO;
import com.ecommerce.pricing.model.DiscountRule;
import com.ecommerce.pricing.repository.DiscountRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRuleRepository discountRuleRepository;

    public List<DiscountRuleDTO> getActiveProductDiscounts(String productId) {
        LocalDate today = LocalDate.now();
        return discountRuleRepository.findActiveProductRules(productId, today)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Computes the best applicable product-level discount percent for a product + category combo.
     * Takes the MAX of product-specific rules and category rules.
     */
    public BigDecimal getBestProductDiscountPercent(String productId, String category) {
        LocalDate today = LocalDate.now();
        BigDecimal maxDiscount = BigDecimal.ZERO;

        if (productId != null && !productId.isBlank()) {
            for (DiscountRule r : discountRuleRepository.findActiveProductRules(productId, today))
                if (r.getDiscountPercent().compareTo(maxDiscount) > 0)
                    maxDiscount = r.getDiscountPercent();
        }
        if (category != null && !category.isBlank()) {
            for (DiscountRule r : discountRuleRepository.findActiveCategoryRules(category, today))
                if (r.getDiscountPercent().compareTo(maxDiscount) > 0)
                    maxDiscount = r.getDiscountPercent();
        }
        // Check CART-level rules too
        for (DiscountRule r : discountRuleRepository.findActiveCartRules(today))
            if (r.getDiscountPercent().compareTo(maxDiscount) > 0)
                maxDiscount = r.getDiscountPercent();

        return maxDiscount;
    }

    private DiscountRuleDTO toDTO(DiscountRule r) {
        return DiscountRuleDTO.builder().id(r.getId()).name(r.getName()).type(r.getType())
                .targetId(r.getTargetId()).discountPercent(r.getDiscountPercent())
                .startDate(r.getStartDate()).endDate(r.getEndDate()).isActive(r.getIsActive()).build();
    }
}
