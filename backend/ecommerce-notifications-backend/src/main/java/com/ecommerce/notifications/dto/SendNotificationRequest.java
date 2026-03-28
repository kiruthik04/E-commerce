package com.ecommerce.notifications.dto;

import com.ecommerce.notifications.model.NotificationType;
import com.ecommerce.notifications.model.ReferenceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendNotificationRequest {
    @NotNull(message = "User ID is mandatory")
    private Long userId;

    private NotificationType type;

    // e.g. "order_placed", "order_shipped", "payment_success"
    // The service translates these triggers into concrete Email/SMS messages.
    @NotBlank(message = "Trigger event is mandatory")
    private String triggerEvent;

    // Optional user contact info override. Otherwise service looks it up or mocks it.
    private String contactChannel; 

    private Long referenceId;
    
    private ReferenceType referenceType;
}
