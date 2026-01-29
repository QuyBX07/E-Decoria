package com.example.Decoria.service;

import com.example.Decoria.dto.UserNotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserNotificationService {

    /**
     * Lấy danh sách thông báo của user (có filter)
     */
    Page<UserNotificationResponse> getMyNotifications(
            UUID userId,
            String type,
            Boolean isRead,
            Pageable pageable
    );

    /**
     * Đếm số thông báo chưa đọc
     */
    long countUnread(UUID userId);

    /**
     * Đánh dấu 1 thông báo là đã đọc
     */
    void markAsRead(UUID userId, UUID userNotificationId);

    /**
     * Đánh dấu tất cả là đã đọc
     */
    void markAllAsRead(UUID userId);
}
