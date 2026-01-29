package com.example.Decoria.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminNotificationResponse {

    private UUID id;
    private String title;
    private String message;
    private String type;
    private LocalDateTime createdAt;

    private boolean sent; // 👈 duy nhất admin cần thêm
}
