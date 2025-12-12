package com.example.Decoria.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ApplyVoucherRequest {
    private UUID userId;
    private BigDecimal orderTotal;
    private String voucherCode;
}
