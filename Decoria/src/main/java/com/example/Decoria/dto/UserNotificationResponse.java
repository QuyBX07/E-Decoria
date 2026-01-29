package com.example.Decoria.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserNotificationResponse {

    private UUID id;                // id của user_notifications
    private UUID notificationId;    // id notification gốc

    private String title;
    private String message;
    private String type;

    private boolean isRead;
    private LocalDateTime createdAt; // thời điểm user nhận
}
