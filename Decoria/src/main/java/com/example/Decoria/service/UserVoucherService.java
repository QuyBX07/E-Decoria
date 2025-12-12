package com.example.Decoria.service;

import com.example.Decoria.dto.UserVoucherResponseDTO;

import java.util.List;
import java.util.UUID;

public interface UserVoucherService {

    void claimVoucher(UUID userId, UUID voucherId);

    List<UserVoucherResponseDTO> getUserVouchers(UUID userId);
}
