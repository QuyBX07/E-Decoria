package com.example.Decoria.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponseDTO {
    private UUID id;
    private UUID productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
}
