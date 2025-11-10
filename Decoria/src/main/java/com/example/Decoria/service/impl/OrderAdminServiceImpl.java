package com.example.Decoria.service.impl;

import com.example.Decoria.dto.OrderAdminResponseDTO;
import com.example.Decoria.entity.Order;
import com.example.Decoria.exception.NotFoundException;
import com.example.Decoria.mapper.OrderMapper;
import com.example.Decoria.repository.OrderRepository;
import com.example.Decoria.service.OrderAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderAdminServiceImpl implements OrderAdminService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    public List<OrderAdminResponseDTO> getAllOrders(String status, String sort) {
        Order.OrderStatus orderStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid order status: " + status);
            }
        }

        String sortOrder = (sort != null && sort.equalsIgnoreCase("asc")) ? "asc" : "desc";

        return orderRepository.findAllWithFilters(orderStatus, sortOrder)
                .stream()
                .map(orderMapper::toAdminDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderAdminResponseDTO getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return orderMapper.toAdminDTO(order);
    }

    @Override
    public void updateOrderStatus(UUID orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        orderRepository.save(order);
    }

    @Override
    public void deleteOrder(UUID orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new NotFoundException("Order not found");
        }
        orderRepository.deleteById(orderId);
    }
}
