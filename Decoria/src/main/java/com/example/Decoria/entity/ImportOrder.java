package com.example.Decoria.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "import_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "supplier_name", nullable = false)
    private String supplierName;

    @Column(name = "import_date")
    private LocalDateTime importDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @PrePersist
    public void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        this.importDate = LocalDateTime.now();
    }
}
