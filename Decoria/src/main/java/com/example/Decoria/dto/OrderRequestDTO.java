package com.example.Decoria.dto;

import com.example.Decoria.entity.Payment;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderRequestDTO {
    private UUID userId;
    private String shippingAddress;
    private String shippingMethod;
    private Payment.PaymentMethod paymentMethod;
    private String recipientName;
    private String recipientPhone;
    private List<OrderItemDTO> items;
    @Getter
    @Setter
    public static class OrderItemDTO {
        private UUID productId;
        private int quantity;
        private BigDecimal unitPrice;
    }
}
