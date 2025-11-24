package com.example.Decoria.repository;

import com.example.Decoria.entity.OrderItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    @Query("""
    SELECT p.id, p.name, SUM(oi.quantity)
    FROM OrderItem oi
    JOIN Product p ON oi.productId = p.id
    GROUP BY p.id, p.name
    ORDER BY SUM(oi.quantity) DESC
""")
    List<Object[]> getBestSellingProducts();
}
