package com.ecommerce.search.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AutocompleteDTO {
    private List<String> productNames;
    private List<String> categories;
}
