package com.ecommerce.search.service;

import com.ecommerce.search.dto.*;
import com.ecommerce.search.model.SearchLog;
import com.ecommerce.search.model.SearchProduct;
import com.ecommerce.search.repository.SearchLogRepository;
import com.ecommerce.search.repository.SearchProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchProductRepository productRepository;
    private final SearchLogRepository logRepository;

    // ── Sort options ──
    private Sort resolveSort(String sort) {
        return switch (sort == null ? "" : sort) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "newest"     -> Sort.by("id").descending();
            case "top_rated"  -> Sort.by("rating").descending();
            default           -> Sort.by("rating").descending().and(Sort.by("reviewCount").descending());
        };
    }

    @Transactional
    public Map<String, Object> search(String q, String category, BigDecimal minPrice,
                                      BigDecimal maxPrice, Boolean inStock, String sort,
                                      int page, int size) {
        Pageable pageable = PageRequest.of(page, size, resolveSort(sort));
        Page<SearchProduct> results = productRepository.search(
                (q != null && !q.isBlank()) ? q.trim() : null,
                (category != null && !category.isBlank()) ? category.trim() : null,
                minPrice, maxPrice, inStock, pageable);

        // Async log search
        String query = (q != null) ? q.trim() : "";
        if (!query.isEmpty()) {
            Long userId = getAuthUserId();
            logRepository.save(SearchLog.builder()
                    .query(query).userId(userId)
                    .resultsCount((int) results.getTotalElements()).build());
        }

        List<SearchResultDTO> dtos = results.getContent().stream()
                .map(this::toDTO).collect(Collectors.toList());

        // Build facets
        List<String> categories = productRepository.findAllDistinctCategories();
        Map<String, Long> priceRanges = buildPriceRanges(results.getContent());
        FacetDTO facets = FacetDTO.builder().categories(categories).priceRanges(priceRanges).build();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", dtos);
        response.put("totalElements", results.getTotalElements());
        response.put("totalPages", results.getTotalPages());
        response.put("currentPage", results.getNumber());
        response.put("facets", facets);
        return response;
    }

    public List<Map<String, Object>> getPopularSearches() {
        return logRepository.findTopQueries().stream().map(row -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("query", row[0]);
            m.put("count", ((Number) row[1]).longValue());
            return m;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void logClick(Long searchLogId, Long productId) {
        logRepository.findById(searchLogId).ifPresent(log -> {
            log.setClickedProductId(productId);
            logRepository.save(log);
        });
    }

    private Map<String, Long> buildPriceRanges(List<SearchProduct> products) {
        Map<String, Long> ranges = new LinkedHashMap<>();
        ranges.put("Under ₹500",     products.stream().filter(p -> p.getPrice().compareTo(new BigDecimal("500")) < 0).count());
        ranges.put("₹500 – ₹1,000",  products.stream().filter(p -> p.getPrice().compareTo(new BigDecimal("500")) >= 0 && p.getPrice().compareTo(new BigDecimal("1000")) <= 0).count());
        ranges.put("₹1,000 – ₹5,000",products.stream().filter(p -> p.getPrice().compareTo(new BigDecimal("1000")) > 0 && p.getPrice().compareTo(new BigDecimal("5000")) <= 0).count());
        ranges.put("Above ₹5,000",    products.stream().filter(p -> p.getPrice().compareTo(new BigDecimal("5000")) > 0).count());
        return ranges;
    }

    private SearchResultDTO toDTO(SearchProduct p) {
        return SearchResultDTO.builder()
                .id(p.getId()).name(p.getName()).category(p.getCategory())
                .price(p.getPrice()).rating(p.getRating()).reviewCount(p.getReviewCount())
                .stockQty(p.getStockQty()).imageUrl(p.getImageUrl())
                .inStock(p.getStockQty() != null && p.getStockQty() > 0).build();
    }

    private Long getAuthUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Long id) return id;
        return null;
    }
}
