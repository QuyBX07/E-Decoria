package com.example.Decoria.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemRequestDTO {
    private UUID productId;
    private Integer quantity;
}
