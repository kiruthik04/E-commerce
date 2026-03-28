package com.ecommerce.pricing.dto;

import com.ecommerce.pricing.model.RuleType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder
public class DiscountRuleDTO {
    private Long id;
    private String name;
    private RuleType type;
    private String targetId;
    private BigDecimal discountPercent;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
}
