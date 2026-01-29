package com.example.Decoria.controller;

import com.example.Decoria.dto.UnreadCountResponse;
import com.example.Decoria.dto.UserNotificationResponse;
import com.example.Decoria.service.AuthService;
import com.example.Decoria.service.UserNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class UserNotificationController {

    private final UserNotificationService userNotificationService;
    private final AuthService authService;

    /**
     * ================================
     * API: LẤY DANH SÁCH THÔNG BÁO CỦA USER
     * ================================
     *
     * - Lấy userId trực tiếp từ JWT (không truyền từ frontend)
     * - Hỗ trợ phân trang
     * - Hỗ trợ filter:
     *      + type: SYSTEM, ORDER, PAYMENT, ...
     *      + isRead: true / false
     *
     * Ví dụ:
     *  GET /api/notifications?page=0&size=10
     *  GET /api/notifications?type=ORDER
     *  GET /api/notifications?isRead=false
     *  GET /api/notifications?type=ORDER&isRead=false
     */
    @GetMapping
    public ResponseEntity<Page<UserNotificationResponse>> getMyNotifications(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        UUID userId = authService.getCurrentUserId();

        // Tạo pageable + sort theo thời gian nhận thông báo (mới nhất trước)
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<UserNotificationResponse> result =
                userNotificationService.getMyNotifications(
                        userId,
                        type,
                        isRead,
                        pageable
                );

        return ResponseEntity.ok(result);
    }

    /**
     * ================================
     * API: ĐẾM SỐ THÔNG BÁO CHƯA ĐỌC
     * ================================
     *
     * Dùng cho badge 🔔 trên frontend
     *
     * Ví dụ:
     *  GET /api/notifications/unread-count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount() {
        UUID userId = authService.getCurrentUserId();

        long unreadCount = userNotificationService.countUnread(userId);

        return ResponseEntity.ok(
                new UnreadCountResponse(unreadCount)
        );
    }

    /**
     * ================================
     * API: ĐÁNH DẤU 1 THÔNG BÁO LÀ ĐÃ ĐỌC
     * ================================
     *
     * - Chỉ user sở hữu thông báo mới được phép đọc
     * - Tránh user đọc thông báo của user khác
     *
     * Ví dụ:
     *  PATCH /api/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        UUID userId = authService.getCurrentUserId();

        userNotificationService.markAsRead(userId, id);

        return ResponseEntity.ok().build();
    }

    /**
     * ================================
     * API: ĐÁNH DẤU TẤT CẢ THÔNG BÁO LÀ ĐÃ ĐỌC
     * ================================
     *
     * Dùng khi user bấm "Đọc tất cả"
     *
     * Ví dụ:
     *  PATCH /api/notifications/read-all
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        UUID userId = authService.getCurrentUserId();

        userNotificationService.markAllAsRead(userId);

        return ResponseEntity.ok().build();
    }
}
