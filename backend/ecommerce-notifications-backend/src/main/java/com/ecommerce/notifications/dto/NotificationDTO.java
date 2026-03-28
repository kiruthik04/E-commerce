package com.ecommerce.notifications.dto;

import com.ecommerce.notifications.model.NotificationStatus;
import com.ecommerce.notifications.model.NotificationType;
import com.ecommerce.notifications.model.ReferenceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDTO {
    private Long id;
    private Long userId;
    private NotificationType type;
    private String subject;
    private String message;
    private NotificationStatus status;
    private Long referenceId;
    private ReferenceType referenceType;
    private LocalDateTime createdAt;
    private boolean isRead;
}
