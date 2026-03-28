package com.ecommerce.notifications.service;

import com.ecommerce.notifications.dto.NotificationDTO;
import com.ecommerce.notifications.dto.SendNotificationRequest;
import com.ecommerce.notifications.exception.ResourceNotFoundException;
import com.ecommerce.notifications.model.Notification;
import com.ecommerce.notifications.model.NotificationStatus;
import com.ecommerce.notifications.model.NotificationType;
import com.ecommerce.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final SMSService smsService;

    @Transactional
    public void processNotificationRequest(SendNotificationRequest request) {
        log.info("Processing notification trigger: {}", request.getTriggerEvent());

        String subject = "";
        String message = "";
        NotificationType[] targetedTypes;

        // Routing logic based on standard e-commerce triggers
        switch (request.getTriggerEvent().toUpperCase()) {
            case "ORDER_PLACED":
                subject = "Order Confirmations - Received!";
                message = "Your order #" + request.getReferenceId() + " has been successfully placed.";
                targetedTypes = new NotificationType[]{NotificationType.IN_APP, NotificationType.EMAIL};
                break;
            case "PAYMENT_SUCCESS":
                subject = "Payment Successful";
                message = "We've received your payment. Thank you!";
                targetedTypes = new NotificationType[]{NotificationType.IN_APP, NotificationType.EMAIL};
                break;
            case "ORDER_SHIPPED":
                subject = "Your Order is on the Way!";
                message = "Great news! Order #" + request.getReferenceId() + " has been shipped.";
                targetedTypes = new NotificationType[]{NotificationType.IN_APP, NotificationType.SMS};
                break;
            case "ORDER_DELIVERED":
                subject = "Order Delivered";
                message = "Order #" + request.getReferenceId() + " has been marked as delivered. Enjoy!";
                targetedTypes = new NotificationType[]{NotificationType.IN_APP, NotificationType.EMAIL};
                break;
            default:
                subject = "System Notification";
                message = "A system event has occurred.";
                targetedTypes = new NotificationType[]{NotificationType.IN_APP};
                break;
        }

        for (NotificationType type : targetedTypes) {
            dispatchNotification(request, type, subject, message);
        }
    }

    private void dispatchNotification(SendNotificationRequest req, NotificationType type, String subject, String message) {
        
        String channel = req.getContactChannel() != null ? req.getContactChannel() : "mockuser@example.com";
        if (type == NotificationType.SMS && req.getContactChannel() == null) {
            channel = "+15550199999"; 
        }

        Notification notification = Notification.builder()
                .userId(req.getUserId())
                .type(type)
                .channel(channel)
                .subject(subject)
                .message(message)
                .referenceId(req.getReferenceId())
                .referenceType(req.getReferenceType())
                .status(NotificationStatus.PENDING)
                .isRead(false)
                .build();
        
        notification = notificationRepository.save(notification);

        boolean success = false;
        if (type == NotificationType.EMAIL) {
            success = emailService.sendEmail(channel, subject, message);
        } else if (type == NotificationType.SMS) {
            success = smsService.sendSMS(channel, message);
        } else if (type == NotificationType.IN_APP) {
            // In App is instantly delivered
            success = true;
        }

        if (success) {
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } else {
            notification.setStatus(NotificationStatus.FAILED);
        }
        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public int getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification not found with ID: " + id);
        }
        notificationRepository.deleteById(id);
    }

    private NotificationDTO mapToDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType())
                .subject(n.getSubject())
                .message(n.getMessage())
                .status(n.getStatus())
                .referenceId(n.getReferenceId())
                .referenceType(n.getReferenceType())
                .createdAt(n.getCreatedAt())
                .isRead(n.isRead())
                .build();
    }
}
