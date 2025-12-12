package com.example.Decoria.dto;

import com.example.Decoria.entity.UserVoucher;
import com.example.Decoria.entity.Voucher;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class UserVoucherResponseDTO {
    private UUID id;
    private UUID voucherId;
    private String code;
    private String description;
    private Voucher.DiscountType discountType;
    private BigDecimal discountValue;
    private LocalDateTime savedAt;
    private UserVoucher.Status status;
}
