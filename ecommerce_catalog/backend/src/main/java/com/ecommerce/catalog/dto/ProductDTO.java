package com.ecommerce.catalog.dto;

import com.ecommerce.catalog.model.Product;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDTO {
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String slug;
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    private BigDecimal discountPrice;

    @NotNull(message = "Stock quantity is required")
    private Integer stockQty;

    private Product.ProductStatus status;
    private Long categoryId;
    private String categoryName;
    private Long sellerId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<ProductImageDTO> images;
    private List<ProductVariantDTO> variants;
}
