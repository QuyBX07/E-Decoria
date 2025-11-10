package com.example.Decoria.service;

import com.example.Decoria.dto.OrderAdminResponseDTO;

import java.util.List;
import java.util.UUID;

public interface OrderAdminService {
    List<OrderAdminResponseDTO> getAllOrders(String status, String sort);
    OrderAdminResponseDTO getOrderById(UUID orderId);
    void updateOrderStatus(UUID orderId, String status);
    void deleteOrder(UUID orderId);
}
