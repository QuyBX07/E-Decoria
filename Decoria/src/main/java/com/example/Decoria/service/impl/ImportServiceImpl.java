package com.example.Decoria.service.impl;

import com.example.Decoria.dto.ImportItemDTO;
import com.example.Decoria.dto.ImportOrderRequest;
import com.example.Decoria.entity.ImportOrder;
import com.example.Decoria.entity.ImportOrderItem;
import com.example.Decoria.entity.Product;
import com.example.Decoria.repository.ImportOrderItemRepository;
import com.example.Decoria.repository.ImportOrderRepository;
import com.example.Decoria.repository.ProductRepository;
import com.example.Decoria.service.ImportService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImportServiceImpl implements ImportService {

    private final ImportOrderRepository importOrderRepository;
    private final ImportOrderItemRepository importOrderItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ImportOrder createImportOrder(ImportOrderRequest request) {
        // 1. Tạo ImportOrder
        ImportOrder order = ImportOrder.builder()
                .supplierName(request.getSupplierName())
                .totalAmount(BigDecimal.ZERO)
                .build();

        order = importOrderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;

        // 2. Lặp qua từng item
        for (ImportItemDTO dto : request.getItems()) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Cộng stock
            int newStock = (product.getStock() == null ? 0 : product.getStock()) + dto.getQuantity();
            product.setStock(newStock);
            productRepository.save(product);

            // Tạo ImportOrderItem
            ImportOrderItem item = ImportOrderItem.builder()
                    .importOrder(order)
                    .product(product)
                    .quantity(dto.getQuantity())
                    .importPrice(dto.getImportPrice())
                    .build();

            importOrderItemRepository.save(item);

            // Cộng tổng tiền
            total = total.add(dto.getImportPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
        }

        // 3. Cập nhật tổng tiền
        order.setTotalAmount(total);
        return importOrderRepository.save(order);
    }

    @Override
    public List<ImportOrder> getAllImports() {
        return importOrderRepository.findAll();
    }

    @Override
    public ImportOrder getImportById(UUID id) {
        return importOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Import order not found"));
    }

    @Override
    @Transactional
    public void deleteImport(UUID id) {
        ImportOrder order = importOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Import order not found"));

        List<ImportOrderItem> items = importOrderItemRepository.findByImportOrder(order);

        for (ImportOrderItem item : items) {
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        importOrderItemRepository.deleteAll(items);
        importOrderRepository.delete(order);
    }
}
