package com.example.Decoria.service;

import com.example.Decoria.entity.Order;
import com.example.Decoria.entity.User;

public interface OrderStatusNotificationService {

    void notifyOrderStatusChanged(
            User user,
            Order order,
            Order.OrderStatus oldStatus,
            Order.OrderStatus newStatus
    );
}
