package com.ecommerce.recommendations.dto;

import com.ecommerce.recommendations.model.BehaviorEvent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TrackEventRequest {
    @NotNull(message = "Product ID is mandatory")
    private Long productId;

    @NotNull(message = "Event type is mandatory")
    private BehaviorEvent eventType;
}
