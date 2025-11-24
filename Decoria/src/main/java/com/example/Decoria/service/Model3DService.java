package com.example.Decoria.service;

import com.example.Decoria.dto.Model3DDTO;
import com.example.Decoria.dto.Model3DRequest;

import java.util.List;
import java.util.UUID;

public interface Model3DService {

    Model3DDTO create(Model3DRequest request);

    Model3DDTO update(UUID id, Model3DRequest request);

    void delete(UUID id);

    Model3DDTO getById(UUID id);

    List<Model3DDTO> getByProductId(UUID productId);

    List<Model3DDTO> getAll();
}
