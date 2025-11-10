package com.example.Decoria.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartUpdateRequestDTO {
    private UUID productId;
    private int quantity;
}
