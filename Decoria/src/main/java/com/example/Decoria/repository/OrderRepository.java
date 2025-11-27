package com.example.Decoria.repository;

import com.example.Decoria.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    //thong ke
    @Query("""
    SELECT FUNCTION('date', o.createdAt),
           COALESCE(SUM(o.totalAmount), 0)
    FROM Order o
    WHERE FUNCTION('date', o.createdAt) BETWEEN :start AND :end
      AND o.status = 'DELIVERED'
    GROUP BY FUNCTION('date', o.createdAt)
    ORDER BY FUNCTION('date', o.createdAt)
""")
    List<Object[]> getRevenueBetweenDates(@Param("start") LocalDate start,
                                          @Param("end") LocalDate end);


    @Query("""
    SELECT FUNCTION('week', o.createdAt), 
           COALESCE(SUM(o.totalAmount), 0)
    FROM Order o
    WHERE FUNCTION('month', o.createdAt) = :month
      AND FUNCTION('year', o.createdAt) = :year
      AND o.status = 'DELIVERED'
    GROUP BY FUNCTION('week', o.createdAt)
    ORDER BY FUNCTION('week', o.createdAt)
""")
    List<Object[]> getRevenueByWeeks(@Param("month") int month,
                                     @Param("year") int year);


    @Query("""
    SELECT FUNCTION('month', o.createdAt),
           COALESCE(SUM(o.totalAmount), 0)
    FROM Order o
    WHERE FUNCTION('year', o.createdAt) = :year
      AND o.status = 'DELIVERED'
    GROUP BY FUNCTION('month', o.createdAt)
    ORDER BY FUNCTION('month', o.createdAt)
""")
    List<Object[]> getRevenueByMonths(@Param("year") int year);


    //profit
    @Query("""
    SELECT COALESCE(SUM(o.totalAmount), 0)
    FROM Order o
    WHERE o.status = 'DELIVERED'
      AND o.createdAt BETWEEN :start AND :end
""")
    BigDecimal getRevenueBetween(LocalDateTime start, LocalDateTime end);;



    @Query("""
        SELECT o.status, COUNT(o)
        FROM Order o
        GROUP BY o.status
    """)
    List<Object[]> getOrderCountByStatus();
}
