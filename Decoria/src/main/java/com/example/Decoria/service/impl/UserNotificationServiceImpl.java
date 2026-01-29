package com.example.Decoria.service.impl;

import com.example.Decoria.dto.UserNotificationResponse;
import com.example.Decoria.entity.User;
import com.example.Decoria.entity.UserNotification;
import com.example.Decoria.mapper.NotificationMapper;
import com.example.Decoria.repository.UserNotificationRepository;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.service.UserNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserNotificationServiceImpl
        implements UserNotificationService {

    private final UserNotificationRepository userNotificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<UserNotificationResponse> getMyNotifications(
            UUID userId,
            String type,
            Boolean isRead,
            Pageable pageable
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Page<UserNotification> page;

        if (type == null && isRead == null) {
            page = userNotificationRepository
                    .findByUserOrderByCreatedAtDesc(user, pageable);

        } else if (type != null && isRead == null) {
            page = userNotificationRepository
                    .findByUserAndNotification_TypeOrderByCreatedAtDesc(
                            user, type, pageable);

        } else if (type == null) {
            page = userNotificationRepository
                    .findByUserAndIsReadOrderByCreatedAtDesc(
                            user, isRead, pageable);

        } else {
            page = userNotificationRepository
                    .findByUserAndNotification_TypeAndIsReadOrderByCreatedAtDesc(
                            user, type, isRead, pageable);
        }

        return page.map(notificationMapper::toUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnread(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userNotificationRepository.countByUserAndIsReadFalse(user);
    }

    @Override
    public void markAsRead(UUID userId, UUID userNotificationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserNotification un = userNotificationRepository
                .findByIdAndUser(userNotificationId, user)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!un.isRead()) {
            un.setRead(true);
            userNotificationRepository.save(un);
        }
    }

    @Override
    public void markAllAsRead(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userNotificationRepository
                .findByUserAndIsReadOrderByCreatedAtDesc(user, false, Pageable.unpaged())
                .forEach(un -> un.setRead(true));
    }
}
