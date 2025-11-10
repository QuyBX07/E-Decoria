package com.example.Decoria.util;

import com.example.Decoria.config.JwtTokenProvider;
import com.example.Decoria.entity.User;
import com.example.Decoria.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuthUtils {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Không tìm thấy người dùng trong SecurityContext");
        }

        String email = authentication.getName(); // lấy từ UsernamePasswordAuthenticationToken
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        return user;
    }

    // nếu muốn dùng trực tiếp token:
    public User getUserFromToken(String token) {
        UUID userId = jwtTokenProvider.getUserIdFromToken(token);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }
}
