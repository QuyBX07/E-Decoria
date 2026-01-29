package com.example.Decoria.service;

import com.example.Decoria.dto.AdminNotificationResponse;
import com.example.Decoria.dto.CreateNotificationRequest;
import com.example.Decoria.dto.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationAdminService {

    NotificationResponse createNotification(CreateNotificationRequest request);

    void sendToUsers(UUID notificationId, List<UUID> userIds);

    void sendToAllUsers(UUID notificationId);

    List<AdminNotificationResponse> getAllNotifications();
}
