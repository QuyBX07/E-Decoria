package com.example.Decoria.service.impl;

import com.example.Decoria.dto.UserVoucherResponseDTO;
import com.example.Decoria.entity.User;
import com.example.Decoria.entity.UserVoucher;
import com.example.Decoria.entity.Voucher;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.repository.UserVoucherRepository;
import com.example.Decoria.repository.VoucherRepository;
import com.example.Decoria.service.UserVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserVoucherServiceImpl implements UserVoucherService {

    private final UserVoucherRepository userVoucherRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;

    @Override
    public void claimVoucher(UUID userId, UUID voucherId) {

        if (userVoucherRepository.existsByUserIdAndVoucherId(userId, voucherId)) {
            throw new RuntimeException("User already claimed this voucher");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        UserVoucher uv = UserVoucher.builder()
                .user(user)
                .voucher(voucher)
                .status(UserVoucher.Status.SAVED)
                .usedCount(0)
                .build();

        userVoucherRepository.save(uv);
    }

    @Override
    public List<UserVoucherResponseDTO> getUserVouchers(UUID userId) {
        return userVoucherRepository.findByUserId(userId)
                .stream()
                .map(uv -> UserVoucherResponseDTO.builder()
                        .id(uv.getId())
                        .voucherId(uv.getVoucher().getId())
                        .code(uv.getVoucher().getCode())
                        .description(uv.getVoucher().getDescription())
                        .discountType(uv.getVoucher().getDiscountType())
                        .discountValue(uv.getVoucher().getDiscountValue())
                        .minOrderValue(uv.getVoucher().getMinOrderValue())
                        .savedAt(uv.getSavedAt())
                        .status(uv.getStatus())
                        .build()
                ).toList();
    }
}
