package com.ecommerce.catalog.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Data
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String slug;
    private Long parentId;
    private List<CategoryDTO> subCategories;
}
