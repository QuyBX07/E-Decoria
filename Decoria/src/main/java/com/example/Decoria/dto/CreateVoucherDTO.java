package com.example.Decoria.dto;

import com.example.Decoria.entity.Voucher;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class CreateVoucherDTO {
    private String code;
    private String description;
    private Voucher.DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderValue;
    private Integer usageLimit;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
