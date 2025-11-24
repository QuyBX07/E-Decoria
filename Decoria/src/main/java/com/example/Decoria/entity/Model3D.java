package com.example.Decoria.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Model3D {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "product_id", columnDefinition = "BINARY(16)")
    private UUID productId;

    @Column(name = "model_url", nullable = false)
    private String modelUrl;

    @Column(name = "preview_image")
    private String previewImage;

    @Column(name = "file_size")
    private Double fileSize;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }
}
