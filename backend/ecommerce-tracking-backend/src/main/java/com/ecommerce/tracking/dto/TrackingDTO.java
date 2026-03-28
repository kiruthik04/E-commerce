package com.ecommerce.tracking.dto;

import com.ecommerce.tracking.model.Milestone;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TrackingDTO {
    private Long id;
    private Long orderId;
    private Milestone currentStatus;
    private String currentLocation;
    private LocalDateTime estimatedDelivery;
    private String driverName;
    private String driverPhone;
    private LocalDateTime updatedAt;
    
    private List<MilestoneDTO> history;
}
