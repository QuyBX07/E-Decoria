package com.example.Decoria.mapper;

import com.example.Decoria.dto.CartItemResponseDTO;
import com.example.Decoria.entity.CartItem;
import org.springframework.stereotype.Component;

@Component
public class CartItemMapper {

    public CartItemResponseDTO toDTO(CartItem item) {
        return CartItemResponseDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImageUrl())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .build();
    }
}
