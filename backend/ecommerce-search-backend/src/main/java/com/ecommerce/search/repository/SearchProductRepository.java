package com.ecommerce.search.repository;

import com.ecommerce.search.model.SearchProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SearchProductRepository extends JpaRepository<SearchProduct, Long> {

    // Full-text search with optional category + price range filters
    @Query("SELECT p FROM SearchProduct p WHERE p.isActive = true " +
           "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "     OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "     OR LOWER(p.category) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:inStock IS NULL OR :inStock = FALSE OR p.stockQty > 0)")
    Page<SearchProduct> search(@Param("q") String q,
                               @Param("category") String category,
                               @Param("minPrice") BigDecimal minPrice,
                               @Param("maxPrice") BigDecimal maxPrice,
                               @Param("inStock") Boolean inStock,
                               Pageable pageable);

    // Autocomplete: names starting with prefix
    @Query("SELECT p.name FROM SearchProduct p WHERE p.isActive = true " +
           "AND LOWER(p.name) LIKE LOWER(CONCAT(:prefix, '%')) ORDER BY p.name")
    List<String> findNamesStartingWith(@Param("prefix") String prefix, Pageable pageable);

    // Distinct categories list for facets
    @Query("SELECT DISTINCT p.category FROM SearchProduct p WHERE p.isActive = true ORDER BY p.category")
    List<String> findAllDistinctCategories();

    // Categories starting with prefix for autocomplete
    @Query("SELECT DISTINCT p.category FROM SearchProduct p WHERE p.isActive = true " +
           "AND LOWER(p.category) LIKE LOWER(CONCAT(:prefix, '%'))")
    List<String> findCategoriesStartingWith(@Param("prefix") String prefix, Pageable pageable);
}
