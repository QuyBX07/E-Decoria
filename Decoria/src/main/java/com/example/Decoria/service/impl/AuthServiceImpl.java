package com.example.Decoria.service.impl;

import com.example.Decoria.dto.UserDTO;
import com.example.Decoria.entity.User;
import com.example.Decoria.mapper.UserMapper;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

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
}
