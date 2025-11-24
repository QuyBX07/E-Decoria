package com.example.Decoria.service.impl;

import com.example.Decoria.dto.ReviewRequestDTO;
import com.example.Decoria.dto.ReviewResponseDTO;
import com.example.Decoria.entity.Order;
import com.example.Decoria.entity.Review;
import com.example.Decoria.repository.OrderRepository;
import com.example.Decoria.repository.ReviewRepository;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReviewResponseDTO createReview(UUID userId, ReviewRequestDTO request) {
        // Lấy đơn hàng
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        System.out.println("Order status = " + order.getStatus());
        // Kiểm tra user sở hữu đơn
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền đánh giá đơn hàng này");
        }


        // Chỉ cho đánh giá khi đơn hàng đã giao
        if (order.getStatus() != Order.OrderStatus.CONFIRMED) { // enum so sánh bằng '!='
            throw new RuntimeException("Đơn hàng chưa hoàn thành – không thể đánh giá");
        }

        // Kiểm tra review trùng
        if (reviewRepository.existsByUserIdAndProductIdAndOrderId(userId, request.getProductId(), request.getOrderId())) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này trong đơn này rồi!");
        }

        Review review = Review.builder()
                .userId(userId)
                .productId(request.getProductId())
                .orderId(request.getOrderId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        return mapToDTO(saved);
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByProduct(UUID productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return reviews.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private ReviewResponseDTO mapToDTO(Review review) {
        String username = userRepository.findById(review.getUserId())
                .map(u -> u.getFullName()) // hoặc getUsername() tùy entity
                .orElse("Người dùng");

        return ReviewResponseDTO.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .username(username) // 👈 thêm ở đây
                .productId(review.getProductId())
                .orderId(review.getOrderId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    //tb rating
    @Override
    public Double getAverageRatingByProduct(UUID productId) {
        Double avg = reviewRepository.findAverageRatingByProductId(productId);
        return avg != null ? avg : 0.0;
    }
}
