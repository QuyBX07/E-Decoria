package com.example.Decoria.controller;

import com.example.Decoria.dto.AdminNotificationResponse;
import com.example.Decoria.dto.CreateNotificationRequest;
import com.example.Decoria.dto.NotificationResponse;
import com.example.Decoria.dto.SendNotificationToUsersRequest;
import com.example.Decoria.service.NotificationAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
public class NotificationAdminController {

    private final NotificationAdminService notificationAdminService;

    /**
     * Admin tạo notification (chưa gửi)
     */
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @RequestBody CreateNotificationRequest request
    ) {
        return ResponseEntity.ok(
                notificationAdminService.createNotification(request)
        );
    }

    /**
     * Gửi notification cho danh sách user
     */
    @PostMapping("/{notificationId}/send")
    public ResponseEntity<Void> sendToUsers(
            @PathVariable UUID notificationId,
            @RequestBody SendNotificationToUsersRequest request
    ) {
        notificationAdminService.sendToUsers(
                notificationId,
                request.getUserIds()
        );
        return ResponseEntity.ok().build();
    }

    /**
     * Gửi notification cho toàn bộ user
     */
    @PostMapping("/{notificationId}/send-all")
    public ResponseEntity<Void> sendToAllUsers(
            @PathVariable UUID notificationId
    ) {
        notificationAdminService.sendToAllUsers(notificationId);
        return ResponseEntity.ok().build();
    }

    /**
     * Lấy danh sách tất cả notification (kèm trạng thái sent)
     */
    @GetMapping
    public ResponseEntity<List<AdminNotificationResponse>> getAllNotifications() {
        return ResponseEntity.ok(
                notificationAdminService.getAllNotifications()
        );
    }

}
