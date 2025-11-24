package com.example.Decoria.repository;

import com.example.Decoria.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    // Kiểm tra user đã review sản phẩm này trong đơn này chưa
    boolean existsByUserIdAndProductIdAndOrderId(UUID userId, UUID productId, UUID orderId);

    // Lấy tất cả review của sản phẩm
    List<Review> findByProductIdOrderByCreatedAtDesc(UUID productId);

    //tb rating
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
    Double findAverageRatingByProductId(UUID productId);
    int countByProductId(UUID productId);
}
