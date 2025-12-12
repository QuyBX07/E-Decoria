package com.example.Decoria.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;  
    // ID của bản ghi user - notification, dùng UUID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    // Người nhận thông báo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;
    // Thông báo gốc

    @Column(nullable = false)
    private boolean isRead = false;
    // Trạng thái đã đọc:
    // false = chưa đọc
    // true = đã đọc

    @CreationTimestamp
    private LocalDateTime createdAt;  
    // Thời điểm user nhận thông báo
}
