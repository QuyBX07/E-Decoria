package com.example.Decoria.dto;

import com.example.Decoria.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class OrderResponseDTO {
    private UUID id;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String shippingMethod;
    private List<OrderItem> items;
    private String transactionId;
    private String createdAt;
}
