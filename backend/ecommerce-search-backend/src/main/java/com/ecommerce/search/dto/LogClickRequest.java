package com.ecommerce.search.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LogClickRequest {
    private Long searchLogId;
    private Long clickedProductId;
}
