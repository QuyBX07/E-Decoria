package com.example.Decoria.mapper;

import com.example.Decoria.dto.UserDTO;
import com.example.Decoria.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "password", ignore = true) // Không map password khi trả về
    UserDTO toDTO(User user);

    User toEntity(UserDTO dto);
}
