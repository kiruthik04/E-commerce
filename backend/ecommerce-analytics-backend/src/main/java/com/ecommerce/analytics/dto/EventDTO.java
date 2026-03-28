package com.ecommerce.analytics.dto;

import com.ecommerce.analytics.model.EventType;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class EventDTO {
    @NotNull(message = "Event type is required")
    private EventType eventType;
    private Long userId;
    private Long productId;
    private String metadata; // JSON string
}
