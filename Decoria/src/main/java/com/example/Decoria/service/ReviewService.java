package com.example.Decoria.service;

import com.example.Decoria.dto.ReviewRequestDTO;
import com.example.Decoria.dto.ReviewResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ReviewService {

    ReviewResponseDTO createReview(UUID userId, ReviewRequestDTO request);

    List<ReviewResponseDTO> getReviewsByProduct(UUID productId);

    Double getAverageRatingByProduct(UUID productId);
}
