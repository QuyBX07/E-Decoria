package com.example.Decoria.repository;

import com.example.Decoria.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    // tìm theo type nếu cần (ORDER, PAYMENT, SYSTEM...)
    // List<Notification> findByType(String type);
    Optional<Notification> findByTypeAndMessage(String type, String message);

}
