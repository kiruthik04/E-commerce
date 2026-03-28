package com.ecommerce.tracking.service;

import com.ecommerce.tracking.dto.MilestoneDTO;
import com.ecommerce.tracking.dto.TrackingDTO;
import com.ecommerce.tracking.exception.ResourceNotFoundException;
import com.ecommerce.tracking.model.DeliveryMilestone;
import com.ecommerce.tracking.model.Milestone;
import com.ecommerce.tracking.model.TrackingRecord;
import com.ecommerce.tracking.repository.DeliveryMilestoneRepository;
import com.ecommerce.tracking.repository.TrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final TrackingRepository trackingRepository;
    private final DeliveryMilestoneRepository milestoneRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public TrackingDTO getTrackingByOrderId(Long orderId) {
        TrackingRecord record = trackingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tracking record not found for this order."));
        
        List<DeliveryMilestone> history = milestoneRepository.findByOrderIdOrderByTimestampAsc(orderId);
        
        return mapToDTO(record, history);
    }

    @Transactional
    public TrackingDTO addMilestone(Long orderId, Milestone milestoneEnum, String location, String notes) {
        TrackingRecord record = trackingRepository.findByOrderId(orderId).orElseGet(() -> {
             // Create new tracking record if it doesn't exist
             return TrackingRecord.builder()
                     .orderId(orderId)
                     .currentStatus(Milestone.ORDER_PLACED)
                     .currentLocation("Origin Facility")
                     .estimatedDelivery(LocalDateTime.now().plusDays(3))
                     .driverName(milestoneEnum.ordinal() >= Milestone.DISPATCHED.ordinal() ? "John Doe" : null)
                     .driverPhone(milestoneEnum.ordinal() >= Milestone.DISPATCHED.ordinal() ? "+1234567890" : null)
                     .build();
        });

        record.setCurrentStatus(milestoneEnum);
        if (location != null) {
            record.setCurrentLocation(location);
        }
        TrackingRecord savedRecord = trackingRepository.save(record);

        DeliveryMilestone newMilestone = DeliveryMilestone.builder()
                .orderId(orderId)
                .milestone(milestoneEnum)
                .location(location)
                .notes(notes)
                .build();
        
        milestoneRepository.save(newMilestone);

        TrackingDTO trackingDTO = getTrackingByOrderId(orderId);
        
        // Push the populated update to subscribed WS clients
        messagingTemplate.convertAndSend("/topic/tracking/" + orderId, trackingDTO);
        
        return trackingDTO;
    }

    @Transactional
    public TrackingDTO updateLocation(Long orderId, String newLocation) {
        TrackingRecord record = trackingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tracking record not found"));
        
        record.setCurrentLocation(newLocation);
        trackingRepository.save(record);
        
        TrackingDTO trackingDTO = getTrackingByOrderId(orderId);
        
        // Push location update to subscribed WS clients
        messagingTemplate.convertAndSend("/topic/tracking/" + orderId, trackingDTO);
        
        return trackingDTO;
    }

    private TrackingDTO mapToDTO(TrackingRecord record, List<DeliveryMilestone> history) {
        List<MilestoneDTO> dtos = history.stream().map(h -> MilestoneDTO.builder()
                .id(h.getId())
                .orderId(h.getOrderId())
                .milestone(h.getMilestone())
                .location(h.getLocation())
                .notes(h.getNotes())
                .timestamp(h.getTimestamp())
                .build()).collect(Collectors.toList());

        return TrackingDTO.builder()
                .id(record.getId())
                .orderId(record.getOrderId())
                .currentStatus(record.getCurrentStatus())
                .currentLocation(record.getCurrentLocation())
                .estimatedDelivery(record.getEstimatedDelivery())
                .driverName(record.getDriverName())
                .driverPhone(record.getDriverPhone())
                .updatedAt(record.getUpdatedAt())
                .history(dtos)
                .build();
    }
}
