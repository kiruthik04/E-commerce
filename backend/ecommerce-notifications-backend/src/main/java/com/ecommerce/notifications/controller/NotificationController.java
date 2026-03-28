package com.ecommerce.notifications.controller;

import com.ecommerce.notifications.dto.NotificationDTO;
import com.ecommerce.notifications.dto.SendNotificationRequest;
import com.ecommerce.notifications.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Triggered internally by other microservices (Order, Payment). 
    // In a production system, this would be on a private network or require a Service-to-Service API key.
    @PostMapping("/send")
    public ResponseEntity<Void> sendNotification(@Valid @RequestBody SendNotificationRequest request) {
        notificationService.processNotificationRequest(request);
        return ResponseEntity.ok().build();
    }

    // Secured via JWT Filter
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(
            @PathVariable Long userId, @AuthenticationPrincipal Long authenticatedId) {
        // Enforce JWT matches requested resource
        if (!userId.equals(authenticatedId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Integer>> getUnreadCount(
            @PathVariable Long userId, @AuthenticationPrincipal Long authenticatedId) {
        if (!userId.equals(authenticatedId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(userId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}
