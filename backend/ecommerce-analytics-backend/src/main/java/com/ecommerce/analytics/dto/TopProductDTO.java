package com.ecommerce.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopProductDTO {
    private Long productId;
    private Long count;       // views or purchases
    private Long revenue;     // estimated
}
