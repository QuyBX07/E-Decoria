package com.example.Decoria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class BestSellingProductDTO {
    private String productId;
    private String productName;
    private int totalSold;
}
