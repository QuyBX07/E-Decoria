package com.example.Decoria.controller;

import com.example.Decoria.dto.Model3DDTO;
import com.example.Decoria.dto.Model3DRequest;
import com.example.Decoria.service.Model3DService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class Model3DController {

    private final Model3DService service;

    @PostMapping
    public ResponseEntity<Model3DDTO> create(@RequestBody Model3DRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Model3DDTO> update(@PathVariable UUID id, @RequestBody Model3DRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Model3DDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Model3DDTO>> getByProductId(@PathVariable UUID productId) {
        return ResponseEntity.ok(service.getByProductId(productId));
    }

    @GetMapping
    public ResponseEntity<List<Model3DDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
