package com.example.Decoria.controller;

import com.example.Decoria.dto.OrderDetailResponseDTO;
import com.example.Decoria.dto.OrderRequestDTO;
import com.example.Decoria.dto.OrderResponseDTO;
import com.example.Decoria.exception.NotFoundException;
import com.example.Decoria.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponseDTO createOrder(@RequestBody OrderRequestDTO request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/user/{userId}")
    public List<OrderDetailResponseDTO> getOrdersByUser(@PathVariable UUID userId) {
        return orderService.getOrdersByUser(userId);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID orderId) {
        try {
            OrderResponseDTO cancelled = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(cancelled);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi khi hủy đơn hàng");
        }
    }

    @GetMapping("/{orderId}")
    public OrderResponseDTO getOrderDetail(@PathVariable UUID orderId) {
        return orderService.getOrderDetail(orderId);
    }

    @GetMapping("/detail/{orderId}")
    public ResponseEntity<OrderDetailResponseDTO> getOrderDetails(@PathVariable UUID orderId) {
        OrderDetailResponseDTO orderDetails = orderService.getOrderDetails(orderId);
        return ResponseEntity.ok(orderDetails);
    }
}
