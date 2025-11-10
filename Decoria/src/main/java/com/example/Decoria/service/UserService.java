package com.example.Decoria.service;

import com.example.Decoria.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface UserService {

    List<UserDTO> getAll();

    UserDTO getById(UUID id);

    UserDTO create(UserDTO dto);

    UserDTO update(UUID id, UserDTO dto);

    void delete(UUID id);

    UserDTO getByEmail(String email);
    UserDTO updateByEmail(String email, UserDTO dto);
    void changePassword(String email, String oldPassword, String newPassword);

}
