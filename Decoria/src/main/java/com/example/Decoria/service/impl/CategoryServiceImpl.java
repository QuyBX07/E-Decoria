package com.example.Decoria.service.impl;

import com.example.Decoria.dto.CategoryDTO;
import com.example.Decoria.entity.Category;
import com.example.Decoria.mapper.CategoryMapper;
import com.example.Decoria.repository.CategoryRepository;
import com.example.Decoria.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getById(UUID id) {
        return categoryRepository.findById(id)
                .map(categoryMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public CategoryDTO create(CategoryDTO dto) {
        Category category = categoryMapper.toEntity(dto);
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public CategoryDTO update(UUID id, CategoryDTO dto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setImageCategory(dto.getImageCategory());
        return categoryMapper.toDTO(categoryRepository.save(existing));
    }

    @Override
    public void delete(UUID id) {
        categoryRepository.deleteById(id);
    }
}
