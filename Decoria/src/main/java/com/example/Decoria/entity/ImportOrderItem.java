package com.example.Decoria.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "import_order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "import_order_id", nullable = false, columnDefinition = "BINARY(16)")
    private ImportOrder importOrder;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, columnDefinition = "BINARY(16)")
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "import_price", nullable = false)
    private BigDecimal importPrice;
}
