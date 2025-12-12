package com.example.Decoria.controller;

import com.example.Decoria.dto.UserVoucherResponseDTO;
import com.example.Decoria.service.UserVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-vouchers")
@RequiredArgsConstructor
public class UserVoucherController {

    private final UserVoucherService userVoucherService;

    // User claim voucher (săn mã)
    @PostMapping("/claim")
    public ResponseEntity<String> claimVoucher(
            @RequestParam UUID userId,
            @RequestParam UUID voucherId
    ) {
        userVoucherService.claimVoucher(userId, voucherId);
        return ResponseEntity.ok("Voucher saved successfully.");
    }

    // User xem danh sách voucher của mình
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserVoucherResponseDTO>> getUserVouchers(@PathVariable UUID userId) {
        return ResponseEntity.ok(userVoucherService.getUserVouchers(userId));
    }
}
