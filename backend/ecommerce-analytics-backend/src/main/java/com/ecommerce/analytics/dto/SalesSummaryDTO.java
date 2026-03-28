package com.ecommerce.analytics.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class SalesSummaryDTO {
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long totalItemsSold;
    private Long newUsers;
    private BigDecimal avgOrderValue;
}
