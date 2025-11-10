package com.example.Decoria.controller;

import com.example.Decoria.dto.OrderAdminResponseDTO;
import com.example.Decoria.service.OrderAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderAdminController {

    private final OrderAdminService orderAdminService;

    // 🔍 Lấy danh sách đơn hàng (có filter & sort)
    @GetMapping
    public ResponseEntity<List<OrderAdminResponseDTO>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "desc") String sort
    ) {
        List<OrderAdminResponseDTO> orders = orderAdminService.getAllOrders(status, sort);
        return ResponseEntity.ok(orders);
    }

    // 📦 Lấy chi tiết đơn hàng
    @GetMapping("/{id}")
    public ResponseEntity<OrderAdminResponseDTO> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderAdminService.getOrderById(id));
    }

    // 🛠 Cập nhật trạng thái đơn hàng
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable UUID id,
            @RequestParam String status
    ) {
        orderAdminService.updateOrderStatus(id, status);
        return ResponseEntity.ok("Updated order status to " + status);
    }

    // 🗑 Xóa đơn hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable UUID id) {
        orderAdminService.deleteOrder(id);
        return ResponseEntity.ok("Order deleted");
    }
}
