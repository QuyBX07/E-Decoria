package com.example.Decoria.service;

import com.example.Decoria.dto.*;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO request);
    List<OrderDetailResponseDTO> getOrdersByUser(UUID userId);
    OrderResponseDTO getOrderDetail(UUID orderId);
    OrderResponseDTO cancelOrder(UUID orderId);
    OrderDetailResponseDTO getOrderDetails(UUID orderId);

    //order
    ApplyVoucherResponse applyVoucher(ApplyVoucherRequest request);

    public String retryPayment(UUID orderId, String ipAddr);

}
