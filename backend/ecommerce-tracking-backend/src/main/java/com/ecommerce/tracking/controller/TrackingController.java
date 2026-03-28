package com.ecommerce.tracking.controller;

import com.ecommerce.tracking.dto.MilestoneDTO;
import com.ecommerce.tracking.dto.TrackingDTO;
import com.ecommerce.tracking.dto.UpdateLocationRequest;
import com.ecommerce.tracking.model.Milestone;
import com.ecommerce.tracking.service.TrackingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    // Public endpoint to view tracking info
    @GetMapping("/{orderId}")
    public ResponseEntity<TrackingDTO> getOrderTracking(@PathVariable Long orderId) {
        return ResponseEntity.ok(trackingService.getTrackingByOrderId(orderId));
    }

    // Role secured via SecurityConfig (ADMIN/DRIVER)
    @PostMapping("/{orderId}/milestone")
    public ResponseEntity<TrackingDTO> addMilestone(@PathVariable Long orderId, 
                                                    @RequestParam Milestone milestone,
                                                    @RequestParam(required = false) String location,
                                                    @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(trackingService.addMilestone(orderId, milestone, location, notes));
    }

    // Role secured via SecurityConfig (ADMIN/DRIVER)
    @PutMapping("/{orderId}/location")
    public ResponseEntity<TrackingDTO> updateLocation(@PathVariable Long orderId, 
                                                      @Valid @RequestBody UpdateLocationRequest request) {
        return ResponseEntity.ok(trackingService.updateLocation(orderId, request.getLocation()));
    }
}
