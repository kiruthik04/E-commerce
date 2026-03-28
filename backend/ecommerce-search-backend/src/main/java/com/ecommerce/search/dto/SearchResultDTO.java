package com.ecommerce.search.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class SearchResultDTO {
    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private Double rating;
    private Integer reviewCount;
    private Integer stockQty;
    private String imageUrl;
    private boolean inStock;
}
