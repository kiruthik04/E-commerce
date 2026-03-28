package com.ecommerce.analytics.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class RevenueReportDTO {
    private LocalDate date;
    private BigDecimal revenue;
    private Long orders;
    private Long itemsSold;
    private Long newUsers;
}
