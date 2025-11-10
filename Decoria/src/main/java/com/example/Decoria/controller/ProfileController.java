package com.example.Decoria.controller;

import com.example.Decoria.dto.UserDTO;
import com.example.Decoria.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    // ✅ Lấy thông tin cá nhân (user hiện tại)
    @GetMapping
    public UserDTO getProfile(@AuthenticationPrincipal String email) {
        return userService.getByEmail(email);
    }

    // ✅ Cập nhật thông tin cá nhân
    @PutMapping
    public UserDTO updateProfile(@AuthenticationPrincipal String email,
                                 @RequestBody UserDTO dto) {
        return userService.updateByEmail(email, dto);
    }

    // ✅ Đổi mật khẩu
    @PutMapping("/change-password")
    public String changePassword(@AuthenticationPrincipal String email,
                                 @RequestParam String oldPassword,
                                 @RequestParam String newPassword) {
        userService.changePassword(email, oldPassword, newPassword);
        return "Đổi mật khẩu thành công!";
    }
}
