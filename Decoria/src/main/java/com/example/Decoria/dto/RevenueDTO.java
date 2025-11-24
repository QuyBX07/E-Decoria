package com.example.Decoria.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RevenueDTO {
    private BigDecimal value;

    public RevenueDTO(BigDecimal value) {
        this.value = value;
    }
}
