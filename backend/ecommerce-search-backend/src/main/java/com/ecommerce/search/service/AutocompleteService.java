package com.ecommerce.search.service;

import com.ecommerce.search.dto.AutocompleteDTO;
import com.ecommerce.search.repository.SearchProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AutocompleteService {

    private final SearchProductRepository productRepository;

    public AutocompleteDTO getSuggestions(String prefix) {
        if (prefix == null || prefix.trim().length() < 2) {
            return AutocompleteDTO.builder().productNames(List.of()).categories(List.of()).build();
        }
        String p = prefix.trim();
        List<String> names = productRepository.findNamesStartingWith(p, PageRequest.of(0, 7));
        List<String> categories = productRepository.findCategoriesStartingWith(p, PageRequest.of(0, 4));
        return AutocompleteDTO.builder().productNames(names).categories(categories).build();
    }
}
