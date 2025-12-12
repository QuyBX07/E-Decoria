package com.example.Decoria.service.impl;

import com.example.Decoria.dto.UserDTO;
import com.example.Decoria.entity.User;
import com.example.Decoria.mapper.UserMapper;
import com.example.Decoria.repository.UserRepository;
import com.example.Decoria.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public List<UserDTO> getAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getById(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserDTO create(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole());
        User saved = userRepository.save(user);
        return userMapper.toDTO(saved);
    }

    @Override
    public UserDTO update(UUID id, UserDTO dto) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existing.setFullName(dto.getFullName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());
        existing.setRole(dto.getRole());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(dto.getPassword());
        }
        return userMapper.toDTO(userRepository.save(existing));
    }

    @Override
    public void delete(UUID id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO getByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserDTO updateByEmail(String email, UserDTO dto) {
        User existing = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setFullName(dto.getFullName());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());
        existing.setAvatar(dto.getAvatar());

        User updated = userRepository.save(existing);
        return userMapper.toDTO(updated);
    }

    @Override
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public UserDTO updateAvatar(UUID id, MultipartFile avatar) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo thư mục images nếu chưa có
        File dir = new File("images/");
        if (!dir.exists()) dir.mkdirs();

        // Tạo tên file duy nhất
        String filename = System.currentTimeMillis() + "_" + avatar.getOriginalFilename();
        Path path = Paths.get("images/" + filename);

        try {
            // Lưu file
            Files.copy(avatar.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save avatar");
        }

        // Xóa avatar cũ (nếu có)
        if (user.getAvatar() != null) {
            File oldFile = new File("images/" + user.getAvatar());
            if (oldFile.exists()) oldFile.delete();
        }

        // Cập nhật DB
        String avatarUrl = "http://localhost:8081/images/" + filename;
        user.setAvatar(avatarUrl);

        return userMapper.toDTO(userRepository.save(user));
    }


}
