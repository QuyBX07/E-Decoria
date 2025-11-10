package com.example.Decoria.service;

import com.example.Decoria.dto.OrderDetailResponseDTO;
import com.example.Decoria.dto.OrderItemDetailDTO;
import com.example.Decoria.dto.OrderRequestDTO;
import com.example.Decoria.dto.OrderResponseDTO;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO request);
    List<OrderDetailResponseDTO> getOrdersByUser(UUID userId);
    OrderResponseDTO getOrderDetail(UUID orderId);
    OrderResponseDTO cancelOrder(UUID orderId);
    OrderDetailResponseDTO getOrderDetails(UUID orderId);
}
