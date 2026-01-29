package com.example.Decoria.service.impl;

import com.example.Decoria.dto.AdminNotificationResponse;
import com.example.Decoria.dto.CreateNotificationRequest;
import com.example.Decoria.dto.NotificationResponse;
import com.example.Decoria.entity.Notification;
import com.example.Decoria.entity.User;
import com.example.Decoria.entity.UserNotification;
import com.example.Decoria.mapper.NotificationMapper;
import com.example.Decoria.repository.NotificationRepository;
import com.example.Decoria.repository.UserNotificationRepository;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.service.NotificationAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationAdminServiceImpl implements NotificationAdminService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserNotificationRepository userNotificationRepository;
    private final NotificationMapper notificationMapper;

    /**
     * Admin tạo notification (chưa gửi cho ai)
     */
    @Override
    public NotificationResponse createNotification(CreateNotificationRequest request) {

        Notification notification = Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .build();

        Notification saved = notificationRepository.save(notification);

        return notificationMapper.toResponse(saved);
    }

    /**
     * Gửi notification cho danh sách user
     */
    @Override
    @Transactional
    public void sendToUsers(UUID notificationId, List<UUID> userIds) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification không tồn tại"));

        List<User> users = userRepository.findAllById(userIds);

        if (users.isEmpty()) {
            throw new RuntimeException("Danh sách user rỗng");
        }

        for (User user : users) {
            UserNotification userNotification = UserNotification.builder()
                    .user(user)
                    .notification(notification)
                    .isRead(false)
                    .build();

            userNotificationRepository.save(userNotification);
        }
    }

    /**
     * Gửi notification cho toàn bộ user
     */
    @Override
    @Transactional
    public void sendToAllUsers(UUID notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification không tồn tại"));

        List<User> users = userRepository.findAll();

        for (User user : users) {
            UserNotification userNotification = UserNotification.builder()
                    .user(user)
                    .notification(notification)
                    .isRead(false)
                    .build();

            userNotificationRepository.save(userNotification);
        }
    }

    //xem danh sach thong bao
    @Override
    public List<AdminNotificationResponse> getAllNotifications() {

        return notificationRepository.findAll().stream()
                .map(notification -> {

                    boolean sent =
                            userNotificationRepository.countByNotification(notification) > 0;

                    return AdminNotificationResponse.builder()
                            .id(notification.getId())
                            .title(notification.getTitle())
                            .message(notification.getMessage())
                            .type(notification.getType())
                            .createdAt(notification.getCreatedAt())
                            .sent(sent)
                            .build();
                })
                .toList();
    }

}
