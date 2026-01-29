package com.example.Decoria.service;

import com.example.Decoria.dto.UserDTO;

import java.util.UUID;

public interface AuthService {
    UserDTO register(UserDTO userDTO);
    UUID getCurrentUserId();
}
