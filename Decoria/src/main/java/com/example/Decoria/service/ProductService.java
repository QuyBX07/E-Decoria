package com.example.Decoria.service;

import com.example.Decoria.dto.ProductDTO;
import java.util.List;
import java.util.UUID;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(UUID id);
    ProductDTO createProduct(ProductDTO dto);
    ProductDTO updateProduct(UUID id, ProductDTO dto);
    void deleteProduct(UUID id);
    List<ProductDTO> getRelatedProducts(UUID productId);;

}
