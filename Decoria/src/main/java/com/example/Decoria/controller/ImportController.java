package com.example.Decoria.controller;

import com.example.Decoria.dto.ImportOrderRequest;
import com.example.Decoria.entity.ImportOrder;
import com.example.Decoria.service.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/imports")
@RequiredArgsConstructor
public class ImportController {

    private final ImportService importService;

    // Tạo đơn nhập
    @PostMapping
    public ResponseEntity<ImportOrder> createImport(@RequestBody ImportOrderRequest request) {
        ImportOrder order = importService.createImportOrder(request);
        return ResponseEntity.ok(order);
    }

    // Lấy danh sách tất cả đơn nhập
    @GetMapping
    public ResponseEntity<List<ImportOrder>> getAllImports() {
        List<ImportOrder> list = importService.getAllImports();
        return ResponseEntity.ok(list);
    }

    // Lấy chi tiết 1 đơn nhập theo id
    @GetMapping("/{id}")
    public ResponseEntity<ImportOrder> getImportById(@PathVariable UUID id) {
        ImportOrder order = importService.getImportById(id);
        return ResponseEntity.ok(order);
    }

    // Xóa đơn nhập
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteImport(@PathVariable UUID id) {
        importService.deleteImport(id);
        return ResponseEntity.ok("Import order deleted successfully");
    }
}
