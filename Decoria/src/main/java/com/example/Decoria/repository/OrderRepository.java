package com.example.Decoria.repository;

import com.example.Decoria.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);
    @Query("SELECT o FROM Order o JOIN FETCH o.payment p JOIN FETCH o.user u")
    List<Order> findAllWithPaymentAndUser();

    @Query("""
        SELECT o FROM Order o
        LEFT JOIN FETCH o.payment p
        LEFT JOIN FETCH o.orderItems
        LEFT JOIN FETCH o.user u
        WHERE (:status IS NULL OR o.status = :status)
        ORDER BY 
            CASE WHEN :sort = 'asc' THEN o.createdAt END ASC,
            CASE WHEN :sort = 'desc' THEN o.createdAt END DESC
        """)
    List<Order> findAllWithFilters(@Param("status") Order.OrderStatus status,
                                   @Param("sort") String sort);
}
