package com.example.Decoria.repository;

import com.example.Decoria.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("SELECT p FROM Product p WHERE p.categoryId = :categoryId AND p.id <> :productId")
    List<Product> findRelatedProducts(@Param("categoryId") UUID categoryId,
                                      @Param("productId") UUID productId);
}
