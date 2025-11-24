package com.example.Decoria.repository;

import com.example.Decoria.entity.ImportOrder;
import com.example.Decoria.entity.ImportOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ImportOrderItemRepository extends JpaRepository<ImportOrderItem, UUID> {

    List<ImportOrderItem> findByImportOrder(ImportOrder importOrder);
}
