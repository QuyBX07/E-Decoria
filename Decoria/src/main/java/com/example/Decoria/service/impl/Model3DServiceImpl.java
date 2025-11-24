package com.example.Decoria.service.impl;

import com.example.Decoria.dto.Model3DDTO;
import com.example.Decoria.dto.Model3DRequest;
import com.example.Decoria.entity.Model3D;
import com.example.Decoria.repository.Model3DRepository;
import com.example.Decoria.service.Model3DService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Model3DServiceImpl implements Model3DService {

    private final Model3DRepository repository;

    private Model3DDTO convertToDTO(Model3D model) {
        return Model3DDTO.builder()
                .id(model.getId())
                .productId(model.getProductId())
                .modelUrl(model.getModelUrl())
                .previewImage(model.getPreviewImage())
                .fileSize(model.getFileSize())
                .build();
    }

    @Override
    public Model3DDTO create(Model3DRequest request) {
        Model3D model = Model3D.builder()
                .productId(request.getProductId())
                .modelUrl(request.getModelUrl())
                .previewImage(request.getPreviewImage())
                .fileSize(request.getFileSize())
                .build();

        return convertToDTO(repository.save(model));
    }

    @Override
    public Model3DDTO update(UUID id, Model3DRequest request) {
        Model3D model = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model3D not found"));

        model.setProductId(request.getProductId());
        model.setModelUrl(request.getModelUrl());
        model.setPreviewImage(request.getPreviewImage());
        model.setFileSize(request.getFileSize());

        return convertToDTO(repository.save(model));
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Model3D not found");
        }
        repository.deleteById(id);
    }

    @Override
    public Model3DDTO getById(UUID id) {
        return repository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Model3D not found"));
    }

    @Override
    public List<Model3DDTO> getByProductId(UUID productId) {
        return repository.findByProductId(productId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Model3DDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
