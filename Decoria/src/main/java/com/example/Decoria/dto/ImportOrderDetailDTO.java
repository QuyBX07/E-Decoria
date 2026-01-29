package com.example.Decoria.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ImportOrderDetailDTO {
    private UUID id;
    private String supplierName;
    private LocalDateTime importDate;
    private BigDecimal totalAmount;
    private List<ImportOrderItemDTO> items;
}
