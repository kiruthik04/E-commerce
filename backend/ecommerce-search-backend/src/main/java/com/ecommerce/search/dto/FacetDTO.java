package com.ecommerce.search.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class FacetDTO {
    private List<String> categories;
    private Map<String, Long> priceRanges; // e.g. "Under ₹500" -> count
}
