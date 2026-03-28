package com.ecommerce.tracking.dto;

import com.ecommerce.tracking.model.Milestone;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MilestoneDTO {
    private Long id;
    private Long orderId;
    private Milestone milestone;
    private String location;
    private String notes;
    private LocalDateTime timestamp;
}
