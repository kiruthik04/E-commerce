package com.ecommerce.orders.service;

import com.ecommerce.orders.dto.*;
import com.ecommerce.orders.exception.BadRequestException;
import com.ecommerce.orders.exception.ResourceNotFoundException;
import com.ecommerce.orders.model.Order;
import com.ecommerce.orders.model.OrderItem;
import com.ecommerce.orders.model.OrderStatus;
import com.ecommerce.orders.model.OrderStatusHistory;
import com.ecommerce.orders.repository.OrderItemRepository;
import com.ecommerce.orders.repository.OrderRepository;
import com.ecommerce.orders.repository.OrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;

    @Transactional
    public OrderDTO createOrder(Long userId, CreateOrderRequest request, String username) {
        Order order = Order.builder()
                .userId(userId)
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .paymentId(request.getPaymentId())
                .totalAmount(BigDecimal.ZERO)
                .build();
        
        Order savedOrder = orderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;
        
        for (CreateOrderItemRequest itemReq : request.getItems()) {
            OrderItem item = OrderItem.builder()
                    .order(savedOrder)
                    .productId(itemReq.getProductId())
                    .productName(itemReq.getProductName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .totalPrice(itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())))
                    .build();
            orderItemRepository.save(item);
            total = total.add(item.getTotalPrice());
        }

        savedOrder.setTotalAmount(total);
        orderRepository.save(savedOrder);

        recordHistory(savedOrder, null, OrderStatus.PENDING, username);

        return mapToDTO(savedOrder);
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderDetails(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        if (!order.getUserId().equals(userId)) {
            throw new BadRequestException("You do not have permission to view this order");
        }
        return mapToDTO(order);
    }

    @Transactional
    public OrderDTO cancelOrder(Long orderId, Long userId, String username) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new BadRequestException("You do not have permission to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled in its current state: " + order.getStatus());
        }

        OrderStatus previousStatus = order.getStatus();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        recordHistory(order, previousStatus, OrderStatus.CANCELLED, username);

        return mapToDTO(order);
    }

    public Page<OrderDTO> getAllOrdersPaginated(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus newStatus, String adminUsername) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus previousStatus = order.getStatus();

        if (previousStatus == OrderStatus.DELIVERED && newStatus == OrderStatus.PENDING) {
            throw new BadRequestException("Invalid status transition from DELIVERED to PENDING");
        }
        if (previousStatus == OrderStatus.CANCELLED || previousStatus == OrderStatus.REFUNDED) {
             throw new BadRequestException("Cannot change status of a " + previousStatus + " order");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
        recordHistory(order, previousStatus, newStatus, adminUsername);

        return mapToDTO(order);
    }

    private void recordHistory(Order order, OrderStatus prev, OrderStatus next, String changedBy) {
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .previousStatus(prev)
                .newStatus(next)
                .changedBy(changedBy)
                .build();
        historyRepository.save(history);
    }

    private OrderDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = orderItemRepository.findByOrderId(order.getId()).stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        List<OrderStatusHistoryDTO> historyDTOs = historyRepository.findByOrderIdOrderByChangedAtDesc(order.getId()).stream()
                .map(hist -> OrderStatusHistoryDTO.builder()
                        .id(hist.getId())
                        .previousStatus(hist.getPreviousStatus())
                        .newStatus(hist.getNewStatus())
                        .changedAt(hist.getChangedAt())
                        .changedBy(hist.getChangedBy())
                        .build())
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentId(order.getPaymentId())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemDTOs)
                .history(historyDTOs)
                .build();
    }
}
