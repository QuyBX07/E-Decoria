package com.example.Decoria.dto;

import com.example.Decoria.entity.User.Role;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String avatar;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
