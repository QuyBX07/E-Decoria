package com.example.Decoria.service;

import com.example.Decoria.dto.ImportOrderRequest;
import com.example.Decoria.entity.ImportOrder;

import java.util.List;
import java.util.UUID;

public interface ImportService {

    ImportOrder createImportOrder(ImportOrderRequest request);

    List<ImportOrder> getAllImports();

    ImportOrder getImportById(UUID id);

    void deleteImport(UUID id);
}
