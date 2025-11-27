package com.example.Decoria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RevenuePointDTO {
    private String label;     // "Mon", "Week 1", "Jan", ...
    private BigDecimal value; // Doanh thu
}
