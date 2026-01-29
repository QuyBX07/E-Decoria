package com.example.Decoria.service.impl;

import com.example.Decoria.entity.Notification;
import com.example.Decoria.entity.Order;
import com.example.Decoria.entity.User;
import com.example.Decoria.entity.UserNotification;
import com.example.Decoria.repository.NotificationRepository;
import com.example.Decoria.repository.UserNotificationRepository;
import com.example.Decoria.service.OrderStatusNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderStatusNotificationServiceImpl
        implements OrderStatusNotificationService {

    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;

    @Override
    @Transactional
    public void notifyOrderStatusChanged(
            User user,
            Order order,
            Order.OrderStatus oldStatus,
            Order.OrderStatus newStatus
    ) {

        String messageTemplate = mapStatusToMessage(newStatus);

        Notification notification = notificationRepository
                .findByTypeAndMessage("ORDER", messageTemplate)
                .orElseThrow(() -> new RuntimeException(
                        "Notification template not found for ORDER - " + newStatus
                ));

        UserNotification userNotification = UserNotification.builder()
                .user(user)
                .notification(notification)
                .isRead(false)
                .build();

        userNotificationRepository.save(userNotification);
    }

    private String mapStatusToMessage(Order.OrderStatus status) {
        return switch (status) {
            case PENDING -> "Đơn hàng đang chờ xác nhận";
            case CONFIRMED -> "Đơn hàng giao thành công";
            case DELIVERED -> "Đơn hàng đang đến";
            case CANCELLED -> "Đơn hàng đã bị huỷ";
            default -> "Đơn hàng của bạn được cập nhật";
        };
    }
}

