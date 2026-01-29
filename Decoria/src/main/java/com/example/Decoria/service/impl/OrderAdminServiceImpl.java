package com.example.Decoria.service.impl;

import com.example.Decoria.dto.OrderAdminResponseDTO;
import com.example.Decoria.entity.Order;
import com.example.Decoria.entity.OrderItem;
import com.example.Decoria.entity.Payment;
import com.example.Decoria.entity.Product;
import com.example.Decoria.exception.NotFoundException;
import com.example.Decoria.mapper.OrderMapper;
import com.example.Decoria.repository.OrderRepository;
import com.example.Decoria.repository.ProductRepository;
import com.example.Decoria.service.OrderAdminService;
import com.example.Decoria.service.OrderStatusNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderAdminServiceImpl implements OrderAdminService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderStatusNotificationService orderStatusNotificationService;
    private final ProductRepository productRepository;


    @Override
    public List<OrderAdminResponseDTO> getAllOrders(String status, String sort) {
        Order.OrderStatus orderStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid order status: " + status);
            }
        }

        String sortOrder = (sort != null && sort.equalsIgnoreCase("asc")) ? "asc" : "desc";

        return orderRepository.findAllWithFilters(orderStatus, sortOrder)
                .stream()
                .map(orderMapper::toAdminDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderAdminResponseDTO getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return orderMapper.toAdminDTO(order);
    }

    @Override
    @Transactional
    public void updateOrderStatus(UUID orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        Order.OrderStatus oldStatus = order.getStatus();
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());

        // Không đổi trạng thái
        if (oldStatus == newStatus) {
            return;
        }

        // 🔥 ADMIN HỦY → HOÀN KHO (KHÔNG CHẶN GÌ HẾT)
        if (newStatus == Order.OrderStatus.CANCELLED) {

            for (OrderItem item : order.getOrderItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() ->
                                new NotFoundException("Không tìm thấy sản phẩm: " + item.getProductId()));

                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }

            order.setPaymentStatus("CANCELLED");

            if (order.getPayment() != null) {
                order.getPayment().setStatus(Payment.PaymentStatus.FAILED);
            }
        }

        // Logic cũ: xác nhận đã nhận hàng
        if (newStatus == Order.OrderStatus.CONFIRMED) {
            if (order.getPayment() != null) {
                order.getPayment().setStatus(Payment.PaymentStatus.COMPLETED);
            }
            order.setPaymentStatus("PAID");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        orderStatusNotificationService.notifyOrderStatusChanged(
                order.getUser(),
                order,
                oldStatus,
                newStatus
        );
    }

    @Override
    public void deleteOrder(UUID orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new NotFoundException("Order not found");
        }
        orderRepository.deleteById(orderId);
    }
}
