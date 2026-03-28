package com.ecommerce.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data @Builder
public class DashboardSummaryDTO {
    // from Analytics service
    private Long totalRevenue;
    private Long totalOrders;
    private Long newUsers;
    // from Inventory service
    private Long lowStockCount;
    // from Sellers
    private Long totalSellers;
    private Long pendingSellers;
    // service health
    private Boolean analyticsUp;
    private Boolean inventoryUp;
}
