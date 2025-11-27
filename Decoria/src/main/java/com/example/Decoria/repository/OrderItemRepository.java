package com.example.Decoria.repository;

import com.example.Decoria.entity.OrderItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    @Query("""
    SELECT p.id, p.name, SUM(oi.quantity)
    FROM OrderItem oi
    JOIN Product p ON oi.productId = p.id
    JOIN oi.order o
    WHERE (:year IS NULL OR FUNCTION('YEAR', o.createdAt) = :year)
      AND (:month IS NULL OR FUNCTION('MONTH', o.createdAt) = :month)
      AND (:quarter IS NULL OR (FUNCTION('MONTH', o.createdAt) BETWEEN (:quarter-1)*3+1 AND :quarter*3))
    GROUP BY p.id, p.name
    ORDER BY SUM(oi.quantity) DESC
""")
    List<Object[]> getBestSellingProducts(@Param("year") Integer year,
                                          @Param("month") Integer month,
                                          @Param("quarter") Integer quarter);

}
