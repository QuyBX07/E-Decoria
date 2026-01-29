package com.example.Decoria.service.impl;

import com.example.Decoria.config.JwtTokenProvider;
import com.example.Decoria.dto.UserDTO;
import com.example.Decoria.entity.User;
import com.example.Decoria.mapper.UserMapper;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final HttpServletRequest request;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserDTO register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // Nếu không truyền role thì mặc định là CUSTOMER
        if (userDTO.getRole() == null) {
            user.setRole(User.Role.CUSTOMER);
        }

        User saved = userRepository.save(user);
        return userMapper.toDTO(saved);
    }

    @Override
    public UUID getCurrentUserId() {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        String token = header.substring(7);

        UUID userId = jwtTokenProvider.getUserIdFromToken(token);

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return userId;
    }
}
