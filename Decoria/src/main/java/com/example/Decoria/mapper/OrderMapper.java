package com.example.Decoria.mapper;

import com.example.Decoria.dto.OrderAdminResponseDTO;
import com.example.Decoria.entity.Order;
import com.example.Decoria.entity.Payment;
import com.example.Decoria.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class OrderMapper {

    public OrderAdminResponseDTO toAdminDTO(Order order) {
        if (order == null) return null;

        Payment payment = order.getPayment();
        User user = order.getUser(); // ✅ bây giờ đã JOIN FETCH nên an toàn
        LocalDateTime createdAt = order.getCreatedAt() != null
                ? order.getCreatedAt().toLocalDateTime()
                : null;

        return OrderAdminResponseDTO.builder()
                .orderId(order.getId())
                .customerName(user != null ? user.getFullName() : "Khách vãng lai")
                .customerEmail(user != null ? user.getEmail() : "N/A")
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getStatus() != null ? order.getStatus().name() : null)
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(payment != null && payment.getMethod() != null
                        ? payment.getMethod().name()
                        : null)
                .shippingAddress(order.getShippingAddress())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .shippingMethod(order.getShippingMethod())
                .transactionId(payment != null ? payment.getTransactionId() : null)
                .createdAt(createdAt)
                .build();
    }
}
