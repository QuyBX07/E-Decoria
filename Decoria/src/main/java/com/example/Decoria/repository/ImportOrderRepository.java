package com.example.Decoria.repository;

import com.example.Decoria.entity.ImportOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.UUID;

public interface ImportOrderRepository extends JpaRepository<ImportOrder, UUID> {
    @Query("""
        SELECT COALESCE(SUM(io.totalAmount), 0)
        FROM ImportOrder io
    """)
    BigDecimal getTotalImportCost();
}
