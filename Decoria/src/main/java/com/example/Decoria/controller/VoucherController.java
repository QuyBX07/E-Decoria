package com.example.Decoria.controller;

import com.example.Decoria.dto.CreateVoucherDTO;
import com.example.Decoria.dto.VoucherResponseDTO;
import com.example.Decoria.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<List<VoucherResponseDTO>> getAll() {
        return ResponseEntity.ok(voucherService.getAllVouchers());
    }

    // Lấy chi tiết 1 voucher
    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponseDTO> getVoucherById(@PathVariable UUID id) {
        return ResponseEntity.ok(voucherService.getVoucherById(id));
    }

    // ADMIN tạo voucher
    @PostMapping
    public ResponseEntity<VoucherResponseDTO> createVoucher(@RequestBody CreateVoucherDTO dto) {
        return ResponseEntity.ok(voucherService.createVoucher(dto));
    }

    // ADMIN sửa voucher
    @PutMapping("/{id}")
    public ResponseEntity<VoucherResponseDTO> updateVoucher(
            @PathVariable UUID id,
            @RequestBody CreateVoucherDTO dto
    ) {
        return ResponseEntity.ok(voucherService.updateVoucher(id, dto));
    }

    // ADMIN xóa voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable UUID id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.noContent().build();
    }

    // Trả về tất cả voucher đang hoạt động (user dùng để săn)
    @GetMapping("/active")
    public ResponseEntity<List<VoucherResponseDTO>> getActiveVouchers() {
        return ResponseEntity.ok(voucherService.getAllActiveVouchers());
    }

    // Kích hoạt voucher
    @PatchMapping("/{id}/activate")
    public ResponseEntity<VoucherResponseDTO> activate(@PathVariable UUID id) {
        return ResponseEntity.ok(voucherService.activateVoucher(id));
    }

    // Vô hiệu hóa voucher
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<VoucherResponseDTO> deactivate(@PathVariable UUID id) {
        return ResponseEntity.ok(voucherService.deactivateVoucher(id));
    }

}
