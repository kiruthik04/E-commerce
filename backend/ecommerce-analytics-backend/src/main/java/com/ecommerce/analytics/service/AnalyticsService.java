package com.ecommerce.analytics.service;

import com.ecommerce.analytics.dto.EventDTO;
import com.ecommerce.analytics.model.AnalyticsEvent;
import com.ecommerce.analytics.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final EventRepository eventRepository;

    @Transactional
    public void trackEvent(EventDTO dto) {
        AnalyticsEvent event = AnalyticsEvent.builder()
                .eventType(dto.getEventType())
                .userId(dto.getUserId())
                .productId(dto.getProductId())
                .metadata(dto.getMetadata())
                .build();
        eventRepository.save(event);
        log.debug("Tracked event: {} for user={}, product={}", dto.getEventType(), dto.getUserId(), dto.getProductId());
    }
}
