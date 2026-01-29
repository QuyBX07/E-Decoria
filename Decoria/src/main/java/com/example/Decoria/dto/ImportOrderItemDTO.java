package com.example.Decoria.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ImportOrderItemDTO {
    private UUID productId;
    private String productName;
    private Integer quantity;
    private BigDecimal importPrice;
    private BigDecimal subtotal;
}
