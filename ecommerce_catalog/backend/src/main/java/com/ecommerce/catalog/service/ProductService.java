package com.ecommerce.catalog.service;

import com.ecommerce.catalog.dto.ProductDTO;
import com.ecommerce.catalog.dto.ProductImageDTO;
import com.ecommerce.catalog.dto.ProductVariantDTO;
import com.ecommerce.catalog.exception.ResourceNotFoundException;
import com.ecommerce.catalog.model.Category;
import com.ecommerce.catalog.model.Product;
import com.ecommerce.catalog.model.ProductImage;
import com.ecommerce.catalog.model.ProductVariant;
import com.ecommerce.catalog.repository.CategoryRepository;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.catalog.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDTO> getProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
            Product.ProductStatus status, String keyword, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasCategoryId(categoryId))
                .and(ProductSpecification.priceBetween(minPrice, maxPrice))
                .and(ProductSpecification.hasStatus(status))
                .and(ProductSpecification.hasKeyword(keyword));

        return productRepository.findAll(spec, pageable).map(this::mapToDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDTO(product);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToDTO(product);
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto, Long userId) {
        Product product = new Product();
        mapToEntity(dto, product);

        // Auto-generate slug if not provided
        String slug = dto.getSlug() != null && !dto.getSlug().isEmpty() ? dto.getSlug()
                : dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-");

        // Handle unique slug collision
        if (productRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }
        product.setSlug(slug);

        product.setSellerId(userId);
        if (product.getStatus() == null) {
            product.setStatus(Product.ProductStatus.ACTIVE);
        }

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        mapToEntity(dto, product);

        if (dto.getSlug() != null && !dto.getSlug().isEmpty()) {
            product.setSlug(dto.getSlug());
        }

        if (dto.getStatus() != null) {
            product.setStatus(dto.getStatus());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setStatus(Product.ProductStatus.DELETED);
        productRepository.save(product);
    }

    public List<ProductVariantDTO> getProductVariants(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return product.getVariants().stream()
                .map(v -> {
                    ProductVariantDTO dto = new ProductVariantDTO();
                    dto.setId(v.getId());
                    dto.setProductId(v.getProduct().getId());
                    dto.setVariantName(v.getVariantName());
                    dto.setVariantValue(v.getVariantValue());
                    dto.setPriceModifier(v.getPriceModifier());
                    dto.setStock(v.getStock());
                    return dto;
                }).collect(Collectors.toList());
    }

    private void mapToEntity(ProductDTO dto, Product product) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setStockQty(dto.getStockQty());

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
        product.setCategory(category);

        // Images mapping
        if (dto.getImages() != null) {
            if (product.getImages() == null) {
                product.setImages(new ArrayList<>());
            } else {
                product.getImages().clear();
            }
            for (ProductImageDTO imgDto : dto.getImages()) {
                ProductImage image = new ProductImage();
                image.setImageUrl(imgDto.getImageUrl());
                image.setIsPrimary(imgDto.getIsPrimary() != null ? imgDto.getIsPrimary() : false);
                image.setSortOrder(imgDto.getSortOrder() != null ? imgDto.getSortOrder() : 0);
                image.setProduct(product);
                product.getImages().add(image);
            }
        }

        // Variants mapping
        if (dto.getVariants() != null) {
            if (product.getVariants() == null) {
                product.setVariants(new ArrayList<>());
            } else {
                product.getVariants().clear();
            }
            for (ProductVariantDTO vDto : dto.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setVariantName(vDto.getVariantName());
                variant.setVariantValue(vDto.getVariantValue());
                variant.setPriceModifier(vDto.getPriceModifier());
                variant.setStock(vDto.getStock());
                variant.setProduct(product);
                product.getVariants().add(variant);
            }
        }
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setStockQty(product.getStockQty());
        dto.setStatus(product.getStatus());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setSellerId(product.getSellerId());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        if (product.getImages() != null) {
            dto.setImages(product.getImages().stream().map(img -> {
                ProductImageDTO idto = new ProductImageDTO();
                idto.setId(img.getId());
                idto.setProductId(product.getId());
                idto.setImageUrl(img.getImageUrl());
                idto.setIsPrimary(img.getIsPrimary());
                idto.setSortOrder(img.getSortOrder());
                return idto;
            }).collect(Collectors.toList()));
        }

        if (product.getVariants() != null) {
            dto.setVariants(product.getVariants().stream().map(v -> {
                ProductVariantDTO vdto = new ProductVariantDTO();
                vdto.setId(v.getId());
                vdto.setProductId(product.getId());
                vdto.setVariantName(v.getVariantName());
                vdto.setVariantValue(v.getVariantValue());
                vdto.setPriceModifier(v.getPriceModifier());
                vdto.setStock(v.getStock());
                return vdto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
