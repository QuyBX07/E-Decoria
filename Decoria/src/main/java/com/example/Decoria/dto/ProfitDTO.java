package com.example.Decoria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProfitDTO {
    private BigDecimal revenue;
    private BigDecimal importCost;
    private BigDecimal profit;
}
