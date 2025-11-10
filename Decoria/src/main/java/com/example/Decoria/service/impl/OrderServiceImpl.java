package com.example.Decoria.service.impl;

import com.example.Decoria.dto.OrderDetailResponseDTO;
import com.example.Decoria.dto.OrderItemDetailDTO;
import com.example.Decoria.dto.OrderRequestDTO;
import com.example.Decoria.dto.OrderResponseDTO;
import com.example.Decoria.entity.*;
import com.example.Decoria.exception.NotFoundException;
import com.example.Decoria.repository.OrderRepository;
import com.example.Decoria.repository.PaymentRepository;
import com.example.Decoria.repository.ProductRepository;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        // Tạo Order trước
        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .shippingMethod(request.getShippingMethod())
                .status(Order.OrderStatus.PENDING)
                .paymentStatus("UNPAID")
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .build();

        // Danh sách OrderItem
        List<OrderItem> orderItems = request.getItems().stream().map(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new NotFoundException("Product not found with ID: " + item.getProductId()));

            // Kiểm tra tồn kho
            if (product.getStock() < item.getQuantity()) {
                throw new IllegalStateException("Sản phẩm " + product.getName() + " không đủ hàng (Còn lại: " + product.getStock() + ")");
            }

            // Trừ tồn kho
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

            return OrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        // Tính tổng tiền sau khi có danh sách items
        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        // Lưu Order
        Order savedOrder = orderRepository.save(order);

        // Tạo Payment
        Payment payment = Payment.builder()
                .order(savedOrder)
                .amount(totalAmount)
                .method(request.getPaymentMethod())
                .status(Payment.PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        return new OrderResponseDTO(
                savedOrder.getId(),
                totalAmount,
                savedOrder.getStatus().name(),
                payment.getMethod().name(),
                savedOrder.getShippingAddress(),
                savedOrder.getRecipientName(),
                savedOrder.getRecipientPhone(),
                savedOrder.getShippingMethod(),
                orderItems,
                payment.getTransactionId(),
                payment.getCreatedAt() != null ? payment.getCreatedAt().toString() : null
        );
    }


    @Override
    public List<OrderDetailResponseDTO> getOrdersByUser(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(order -> {
                    // Map danh sách item
                    List<OrderItemDetailDTO> detailedItems = order.getOrderItems().stream()
                            .map(item -> {
                                // Lấy product theo id từ item
                                Product product = productRepository.findById(item.getProductId())
                                        .orElse(null);

                                return new OrderItemDetailDTO(
                                        item.getId(),
                                        item.getProductId(),
                                        product != null ? product.getName() : "Sản phẩm không tồn tại",
                                        product != null ? product.getImageUrl() : null,  // nếu trong Product field là "image" thì sửa lại getImage()
                                        item.getQuantity(),
                                        item.getUnitPrice(),
                                        item.getSubtotal()
                                );
                            })
                            .toList();

                    // Lấy payment info (nếu có)
                    Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
                    String paymentMethod = payment != null ? payment.getMethod().name() : "UNKNOWN";
                    String transactionId = payment != null ? payment.getTransactionId() : null;
                    String createdAt = order.getCreatedAt() != null
                            ? order.getCreatedAt().toString()
                            : null;

                    // Trả về DTO tổng
                    return new OrderDetailResponseDTO(
                            order.getId(),
                            order.getTotalAmount(),
                            order.getStatus().name(),
                            paymentMethod,
                            order.getRecipientName(),
                            order.getRecipientPhone(),
                            order.getShippingAddress(),
                            order.getShippingMethod(),
                            detailedItems,
                            transactionId,
                            createdAt
                    );
                })
                .toList();
    }

    @Override
    public OrderResponseDTO getOrderDetail(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);

        String paymentMethod = (payment != null) ? payment.getMethod().name() : "UNKNOWN";
        String transactionId = (payment != null) ? payment.getTransactionId() : null;
        String createdAt = (payment != null && payment.getCreatedAt() != null)
                ? payment.getCreatedAt().toString()
                : (order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);

        return new OrderResponseDTO(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                paymentMethod,
                order.getShippingAddress(),
                order.getRecipientName(),
                order.getRecipientPhone(),
                order.getShippingMethod(),
                order.getOrderItems(),
                transactionId,
                createdAt
        );
    }

    @Override
    @Transactional
    public OrderResponseDTO cancelOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

        // ❌ Kiểm tra trạng thái — chỉ cho phép hủy khi chưa giao
        if (order.getStatus() == Order.OrderStatus.DELIVERED ||
                order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng này không thể hủy");
        }

        // ✅ Cập nhật trạng thái đơn hàng
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setPaymentStatus("CANCELLED");

        // ✅ Nếu có thanh toán, cập nhật trạng thái payment
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        if (payment != null) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }

        // ✅ Hoàn trả tồn kho cho sản phẩm
        for (OrderItem item : order.getOrderItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm: " + item.getProductId()));
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        // ✅ Lưu lại đơn hàng
        orderRepository.save(order);

        // ✅ Trả về DTO kết quả
        Payment finalPayment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        String paymentMethod = (finalPayment != null) ? finalPayment.getMethod().name() : "UNKNOWN";
        String transactionId = (finalPayment != null) ? finalPayment.getTransactionId() : null;
        String createdAt = (finalPayment != null && finalPayment.getCreatedAt() != null)
                ? finalPayment.getCreatedAt().toString()
                : (order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);

        return new OrderResponseDTO(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                paymentMethod,
                order.getShippingAddress(),
                order.getRecipientName(),
                order.getRecipientPhone(),
                order.getShippingMethod(),
                order.getOrderItems(),
                transactionId,
                createdAt
        );
    }

    @Override
    public OrderDetailResponseDTO getOrderDetails(UUID orderId) {
        // Lấy đơn hàng từ DB
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

        // Map từng item sang DTO chi tiết
        List<OrderItemDetailDTO> detailedItems = order.getOrderItems().stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId())
                            .orElse(null);

                    return new OrderItemDetailDTO(
                            item.getId(),
                            item.getProductId(),
                            product != null ? product.getName() : "Sản phẩm không tồn tại",
                            product != null ? product.getImageUrl() : null, // hoặc getImageUrl() nếu đúng field
                            item.getQuantity(),
                            item.getUnitPrice(),
                            item.getSubtotal()
                    );
                })
                .toList();

        // Trả về DTO tổng thể của đơn hàng
        return new OrderDetailResponseDTO(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getPayment() != null ? order.getPayment().getMethod().name() : null,
                order.getRecipientName(),
                order.getRecipientPhone(),
                order.getShippingAddress(),
                order.getShippingMethod(),
                detailedItems,
                order.getPayment() != null ? order.getPayment().getTransactionId() : null,
                order.getCreatedAt().toString()
        );
    }

}
