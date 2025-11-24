package com.example.Decoria.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportItemDTO {

    private UUID productId;       // ID sản phẩm nhập
    private Integer quantity;     // Số lượng nhập
    private LocalDateTime importDatel;
    private BigDecimal importPrice; // Giá nhập cho 1 sản phẩm
}
