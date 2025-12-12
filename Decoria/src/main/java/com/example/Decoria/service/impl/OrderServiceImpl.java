package com.example.Decoria.service.impl;

import com.example.Decoria.dto.*;
import com.example.Decoria.entity.*;
import com.example.Decoria.exception.NotFoundException;
import com.example.Decoria.repository.*;
import com.example.Decoria.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private final VoucherRepository voucherRepository;
    private final UserVoucherRepository userVoucherRepository;

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

        // ==================================================
        // 3️⃣ Xử lý VOUCHER (nếu có voucherId)
        // ==================================================
        if (request.getVoucherId() != null) {

            Voucher voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));

            // Tìm UserVoucher
            UserVoucher userVoucher = userVoucherRepository
                    .findByUserIdAndVoucherId(user.getId(), voucher.getId())
                    .orElseThrow(() -> new RuntimeException("User has not saved this voucher"));

            if (userVoucher.getStatus() == UserVoucher.Status.USED) {
                throw new RuntimeException("Voucher already used");
            }

            // Kiểm tra hạn sử dụng
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
                throw new RuntimeException("Voucher expired or inactive");
            }

            // Kiểm tra min order
            if (voucher.getMinOrderValue() != null &&
                    totalAmount.compareTo(voucher.getMinOrderValue()) < 0) {
                throw new RuntimeException("Order does not meet minimum order value");
            }

            // Kiểm tra usageLimit tổng
            if (voucher.getUsageLimit() != null &&
                    voucher.getUsedCount() >= voucher.getUsageLimit()) {
                throw new RuntimeException("Voucher usage limit reached");
            }

            // Tính giảm giá
            BigDecimal discount;
            if (voucher.getDiscountType() == Voucher.DiscountType.PERCENT) {
                discount = totalAmount.multiply(voucher.getDiscountValue())
                        .divide(BigDecimal.valueOf(100));
            } else {
                discount = voucher.getDiscountValue();
            }

            // Không cho giảm quá nhiều
            if (discount.compareTo(totalAmount) > 0) {
                discount = totalAmount;
            }

            // Áp dụng giảm giá
            totalAmount = totalAmount.subtract(discount);
            order.setTotalAmount(totalAmount);

            // Gán voucher vào Order
            order.setVoucher(voucher);

            // Cập nhật voucher tổng
            voucher.setUsedCount(voucher.getUsedCount() + 1);
            voucherRepository.save(voucher);

            // Cập nhật UserVoucher
            userVoucher.setUsedCount(userVoucher.getUsedCount() + 1);
            userVoucher.setStatus(UserVoucher.Status.USED);
            userVoucherRepository.save(userVoucher);
        }


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
                    String paymentStatus = payment != null ? payment.getStatus().name() : "UNKNOWN";
                    String transactionId = payment != null ? payment.getTransactionId() : null;
                    String createdAt = order.getCreatedAt() != null
                            ? order.getCreatedAt().toString()
                            : null;

                    // Trả về DTO tổng
                    return new OrderDetailResponseDTO(
                            order.getId(),
                            order.getTotalAmount(),
                            order.getStatus().name(),
                            paymentStatus,   // 🆕 thêm đúng vị trí
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
                order.getPayment() != null ? order.getPayment().getStatus().name() : null,
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


    //order
    @Override
    public ApplyVoucherResponse applyVoucher(ApplyVoucherRequest req) {

        Voucher voucher = voucherRepository.findByCode(req.getVoucherCode())
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        //kiẻme tra usedlimit
        if (voucher.getUsageLimit() != null &&
                voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new RuntimeException("Voucher usage limit reached");
        }

        // Kiểm tra ngày
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            throw new RuntimeException("Voucher is expired or not active yet");
        }

        // Kiểm tra min order
        if (voucher.getMinOrderValue() != null &&
                req.getOrderTotal().compareTo(voucher.getMinOrderValue()) < 0) {
            throw new RuntimeException("Order does not meet the minimum value");
        }

        // Kiểm tra user đã claim voucher chưa
        UserVoucher userVoucher = userVoucherRepository
                .findByUserIdAndVoucherId(req.getUserId(), voucher.getId())
                .orElseThrow(() -> new RuntimeException("User has not saved this voucher"));

        if (userVoucher.getStatus() == UserVoucher.Status.USED) {
            throw new RuntimeException("Voucher already used");
        }

        // Tính số tiền giảm
        BigDecimal discount = BigDecimal.ZERO;

        if (voucher.getDiscountType() == Voucher.DiscountType.PERCENT) {
            discount = req.getOrderTotal()
                    .multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100));
        } else {
            discount = voucher.getDiscountValue();
        }

        if (discount.compareTo(req.getOrderTotal()) > 0) {
            discount = req.getOrderTotal();
        }

        BigDecimal finalPrice = req.getOrderTotal().subtract(discount);

        return ApplyVoucherResponse.builder()
                .discount(discount)
                .finalPrice(finalPrice)
                .message("Voucher applied successfully")
                .voucherCode(voucher.getCode())
                .voucherId(voucher.getId())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .build();
    }
}
