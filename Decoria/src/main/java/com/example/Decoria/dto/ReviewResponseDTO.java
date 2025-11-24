package com.example.Decoria.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDTO {
    private UUID id;
    private UUID productId;
    private UUID userId;
    private UUID orderId;
    private String username;  // 👈 thêm
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
