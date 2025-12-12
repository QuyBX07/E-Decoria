package com.example.Decoria.dto;

import com.example.Decoria.entity.Voucher;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
public class ApplyVoucherResponse {
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private String message;
    private String voucherCode;
    private UUID voucherId;
    private Voucher.DiscountType discountType;
    private BigDecimal discountValue;
}
