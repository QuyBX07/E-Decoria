package com.example.Decoria.repository;

import com.example.Decoria.entity.CartItem;
import com.example.Decoria.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    // Lấy toàn bộ giỏ của 1 user
    List<CartItem> findByUser(User user);

    // Xóa sản phẩm khỏi giỏ theo user và productId
    void deleteByUserAndProduct_Id(User user, UUID productId);

    // ✅ Cái này là hàm em đang cần
    Optional<CartItem> findByUser_IdAndProduct_Id(UUID userId, UUID productId);
}
