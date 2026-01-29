package com.example.Decoria.service.impl;

import com.example.Decoria.dto.CreateVoucherDTO;
import com.example.Decoria.dto.VoucherResponseDTO;
import com.example.Decoria.entity.Voucher;
import com.example.Decoria.repository.VoucherRepository;
import com.example.Decoria.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public VoucherResponseDTO createVoucher(CreateVoucherDTO dto) {
        Voucher voucher = Voucher.builder()
                .code(dto.getCode())
                .description(dto.getDescription())
                .discountType(dto.getDiscountType())
                .discountValue(dto.getDiscountValue())
                .minOrderValue(dto.getMinOrderValue())
                .usageLimit(dto.getUsageLimit())
                .usedCount(0)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(Voucher.VoucherStatus.ACTIVE)
                .build();

        voucherRepository.save(voucher);

        return mapToDto(voucher);
    }

    @Override
    public VoucherResponseDTO updateVoucher(UUID id, CreateVoucherDTO dto) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        voucher.setCode(dto.getCode());
        voucher.setDescription(dto.getDescription());
        voucher.setDiscountType(dto.getDiscountType());
        voucher.setDiscountValue(dto.getDiscountValue());
        voucher.setMinOrderValue(dto.getMinOrderValue());
        voucher.setUsageLimit(dto.getUsageLimit());
        voucher.setStartDate(dto.getStartDate());
        voucher.setEndDate(dto.getEndDate());

        voucherRepository.save(voucher);

        return mapToDto(voucher);
    }

    @Override
    public void deleteVoucher(UUID id) {
        voucherRepository.deleteById(id);
    }

    @Override
    public List<VoucherResponseDTO> getAllActiveVouchers() {
        return voucherRepository.findAllActiveVouchers()
                .stream().map(this::mapToDto).toList();
    }

    @Override
    public Voucher getEntityByCode(String code) {
        return voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
    }

    private VoucherResponseDTO mapToDto(Voucher v) {
        return VoucherResponseDTO.builder()
                .id(v.getId())
                .code(v.getCode())
                .description(v.getDescription())
                .discountType(v.getDiscountType())
                .discountValue(v.getDiscountValue())
                .minOrderValue(v.getMinOrderValue())
                .usageLimit(v.getUsageLimit())
                .usedCount(v.getUsedCount())
                .startDate(v.getStartDate())
                .endDate(v.getEndDate())
                .createdAt(v.getCreatedAt())
                .status(v.getStatus())
                .build();
    }

    @Override
    public List<VoucherResponseDTO> getAllVouchers() {
        return voucherRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public VoucherResponseDTO getVoucherById(UUID id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));

        return mapToDto(voucher);
    }


    @Override
    public VoucherResponseDTO activateVoucher(UUID id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        voucher.setStatus(Voucher.VoucherStatus.ACTIVE);
        voucherRepository.save(voucher);

        return mapToDto(voucher);
    }

    @Override
    public VoucherResponseDTO deactivateVoucher(UUID id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        voucher.setStatus(Voucher.VoucherStatus.INACTIVE);
        voucherRepository.save(voucher);

        return mapToDto(voucher);
    }

}
