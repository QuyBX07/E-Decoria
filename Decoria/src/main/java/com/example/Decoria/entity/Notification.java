package com.example.Decoria.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;  
    // ID của thông báo (UUID để đồng bộ với User)

    @Column(nullable = false)
    private String title;  
    // Tiêu đề thông báo

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;  
    // Nội dung thông báo

    @Column(length = 50)
    private String type;  
    // Loại thông báo: ORDER, PAYMENT, VOUCHER, SYSTEM...

    @CreationTimestamp
    private LocalDateTime createdAt;  
    // Thời gian tạo thông báo

    // Không bắt buộc phải có field này ở Notification,
    // nhưng nếu bạn muốn truy ngược: 1 notification -> nhiều user
    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserNotification> userNotifications;
}
