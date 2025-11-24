package com.example.Decoria.service.impl;

import com.example.Decoria.dto.ProductDTO;
import com.example.Decoria.entity.Product;
import com.example.Decoria.exception.NotFoundException;
import com.example.Decoria.mapper.ProductMapper;
import com.example.Decoria.repository.ProductRepository;
import com.example.Decoria.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAllInStock()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(UUID id) {
        return productRepository.findById(id)
                .map(productMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Override
    public ProductDTO createProduct(ProductDTO dto) {
        Product product = productMapper.toEntity(dto);
        return productMapper.toDTO(productRepository.save(product));
    }

    @Override
    public ProductDTO updateProduct(UUID id, ProductDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setStock(dto.getStock());
        existing.setColor(dto.getColor());
        existing.setMaterial(dto.getMaterial());
        existing.setStyle(dto.getStyle());
        existing.setImageUrl(dto.getImageUrl());
        existing.setCategoryId(dto.getCategoryId());
        return productMapper.toDTO(productRepository.save(existing));
    }

    @Override
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDTO> getRelatedProducts(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        UUID categoryId = product.getCategoryId(); // nếu entity của bạn lưu thẳng categoryId
        List<Product> related = productRepository.findRelatedProducts(categoryId, productId);

        return related.stream()
                .limit(6)
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }
}
