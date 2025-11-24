package com.example.Decoria.dto;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequestDTO {
    private UUID productId;
    private UUID orderId;
    private Integer rating;
    private String comment;
}
