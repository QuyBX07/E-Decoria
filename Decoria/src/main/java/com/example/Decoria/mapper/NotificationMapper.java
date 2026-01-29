package com.example.Decoria.mapper;

import com.example.Decoria.dto.NotificationResponse;
import com.example.Decoria.dto.UserNotificationResponse;
import com.example.Decoria.entity.Notification;
import com.example.Decoria.entity.UserNotification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    /**
     * Notification -> NotificationResponse
     */
    public NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .createdAt(n.getCreatedAt())
                .build();
    }

    /**
     * UserNotification -> UserNotificationResponse
     */
    public UserNotificationResponse toUserResponse(UserNotification un) {
        return UserNotificationResponse.builder()
                .id(un.getId())
                .notificationId(un.getNotification().getId())
                .title(un.getNotification().getTitle())
                .message(un.getNotification().getMessage())
                .type(un.getNotification().getType())
                .isRead(un.isRead())
                .createdAt(un.getCreatedAt())
                .build();
    }
}
