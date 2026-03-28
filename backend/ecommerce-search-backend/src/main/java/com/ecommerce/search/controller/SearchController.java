package com.ecommerce.search.controller;

import com.ecommerce.search.dto.*;
import com.ecommerce.search.service.AutocompleteService;
import com.ecommerce.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;
    private final AutocompleteService autocompleteService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(searchService.search(q, category, minPrice, maxPrice, inStock, sort, page, size));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<AutocompleteDTO> autocomplete(@RequestParam String q) {
        return ResponseEntity.ok(autocompleteService.getSuggestions(q));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Map<String, Object>>> getPopularSearches() {
        return ResponseEntity.ok(searchService.getPopularSearches());
    }

    @PostMapping("/log-click")
    public ResponseEntity<Void> logClick(@RequestBody LogClickRequest req) {
        searchService.logClick(req.getSearchLogId(), req.getClickedProductId());
        return ResponseEntity.noContent().build();
    }
}
