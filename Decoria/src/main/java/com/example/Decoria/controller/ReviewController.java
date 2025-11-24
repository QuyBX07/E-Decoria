package com.example.Decoria.controller;

import com.example.Decoria.config.CustomUserPrincipal;
import com.example.Decoria.dto.AverageRatingDTO;
import com.example.Decoria.dto.ReviewRequestDTO;
import com.example.Decoria.dto.ReviewResponseDTO;
import com.example.Decoria.dto.UserDTO;
import com.example.Decoria.service.ReviewService;
import com.example.Decoria.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.Decoria.repository.ReviewRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService; // để lookup userId từ email
    private final ReviewRepository reviewRepository;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @AuthenticationPrincipal String email,
            @RequestBody ReviewRequestDTO dto) {

        // Lấy UUID từ email
        UserDTO user = userService.getByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // hoặc ném exception
        }

        UUID userId = user.getId();
        ReviewResponseDTO created = reviewService.createReview(userId, dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByProduct(
            @PathVariable String productId) {

        UUID prodId = UUID.fromString(productId);
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByProduct(prodId);
        return ResponseEntity.ok(reviews);
    }

    //tb rating
    @GetMapping("/product/{productId}/average")
    public AverageRatingDTO getAverageRating(@PathVariable UUID productId) {
        Double avg = reviewRepository.findAverageRatingByProductId(productId);
        if (avg == null) avg = 0.0;

        int count = reviewRepository.countByProductId(productId);

        return new AverageRatingDTO(productId, avg, count);
    }

}

