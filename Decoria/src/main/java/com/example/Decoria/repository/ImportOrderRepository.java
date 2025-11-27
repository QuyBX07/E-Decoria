package com.example.Decoria.repository;

import com.example.Decoria.entity.ImportOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ImportOrderRepository extends JpaRepository<ImportOrder, UUID> {
    @Query("""
        SELECT COALESCE(SUM(io.totalAmount), 0)
        FROM ImportOrder io
    """)
    BigDecimal getTotalImportCost();

    //profit
    @Query("""
    SELECT COALESCE(SUM(i.totalAmount), 0)
    FROM ImportOrder i
    WHERE i.importDate BETWEEN :start AND :end
""")
    BigDecimal getImportCostBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


    @Query("""
SELECT FUNCTION('month', i.importDate),
       COALESCE(SUM(i.totalAmount), 0)
FROM ImportOrder i
WHERE FUNCTION('year', i.importDate) = :year
GROUP BY FUNCTION('month', i.importDate)
ORDER BY FUNCTION('month', i.importDate)
""")
    List<Object[]> getImportCostByMonths(@Param("year") int year);

}
