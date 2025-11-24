package com.example.Decoria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AverageRatingDTO {
    private UUID productId;
    private double averageRating;
    private int reviewCount;
}
