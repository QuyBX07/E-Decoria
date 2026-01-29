package com.example.Decoria.repository;

import com.example.Decoria.entity.User;
import com.example.Decoria.entity.UserNotification;
import com.example.Decoria.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, UUID> {

    /**
     * Lấy danh sách thông báo của user (có phân trang)
     */
    Page<UserNotification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * Lọc theo type
     */
    Page<UserNotification> findByUserAndNotification_TypeOrderByCreatedAtDesc(
            User user,
            String type,
            Pageable pageable
    );

    /**
     * Lọc theo trạng thái đã đọc / chưa đọc
     */
    Page<UserNotification> findByUserAndIsReadOrderByCreatedAtDesc(
            User user,
            boolean isRead,
            Pageable pageable
    );

    /**
     * Lọc kết hợp type + trạng thái nếu bạn cần
     */
    Page<UserNotification> findByUserAndNotification_TypeAndIsReadOrderByCreatedAtDesc(
            User user,
            String type,
            boolean isRead,
            Pageable pageable
    );

    /**
     * Đếm số thông báo chưa đọc
     */
    long countByUserAndIsReadFalse(User user);

    /**
     * Lấy thông báo cụ thể theo ID + User (tránh xem thông báo của user khác)
     */
    Optional<UserNotification> findByIdAndUser(UUID id, User user);

    /**
     * Lấy tất cả user_notification của 1 notification (dùng cho broadcast)
     */
    // List<UserNotification> findByNotification(Notification notification);
    //kiem tra thong bao
    long countByNotification(Notification notification);

}
