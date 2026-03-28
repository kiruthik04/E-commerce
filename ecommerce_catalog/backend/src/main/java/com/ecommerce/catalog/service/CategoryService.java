package com.ecommerce.catalog.service;

import com.ecommerce.catalog.dto.CategoryDTO;
import com.ecommerce.catalog.exception.ResourceNotFoundException;
import com.ecommerce.catalog.model.Category;
import com.ecommerce.catalog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getCategoryTree() {
        return categoryRepository.findByParentIsNull().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());

        // Use slug directly or generate from name
        String slug = categoryDTO.getSlug() != null && !categoryDTO.getSlug().isEmpty() ? categoryDTO.getSlug()
                : categoryDTO.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        category.setSlug(slug);

        if (categoryDTO.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryDTO.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent Category not found with id: " + categoryDTO.getParentId()));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);
        return mapToDTO(savedCategory);
    }

    private CategoryDTO mapToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
        }
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            dto.setSubCategories(category.getSubCategories().stream().map(this::mapToDTO).collect(Collectors.toList()));
        }
        return dto;
    }
}
