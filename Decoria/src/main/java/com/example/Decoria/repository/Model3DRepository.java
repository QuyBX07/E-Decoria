package com.example.Decoria.repository;

import com.example.Decoria.entity.Model3D;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface Model3DRepository extends JpaRepository<Model3D, UUID> {

    List<Model3D> findByProductId(UUID productId);
}
