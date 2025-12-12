package com.example.Decoria.service;

import com.example.Decoria.dto.CreateVoucherDTO;
import com.example.Decoria.dto.VoucherResponseDTO;
import com.example.Decoria.entity.Voucher;

import java.util.List;
import java.util.UUID;

public interface VoucherService {

    VoucherResponseDTO createVoucher(CreateVoucherDTO dto);

    VoucherResponseDTO updateVoucher(UUID id, CreateVoucherDTO dto);

    void deleteVoucher(UUID id);

    List<VoucherResponseDTO> getAllActiveVouchers();

    Voucher getEntityByCode(String code);

    List<VoucherResponseDTO> getAllVouchers();
    VoucherResponseDTO getVoucherById(UUID id);

    VoucherResponseDTO activateVoucher(UUID id);

    VoucherResponseDTO deactivateVoucher(UUID id);

}
