package com.example.Decoria.service;

import com.example.Decoria.dto.CartItemRequestDTO;
import com.example.Decoria.dto.CartItemResponseDTO;
import com.example.Decoria.entity.User;

import java.util.List;
import java.util.UUID;

public interface CartItemService {
    List<CartItemResponseDTO> getCartItems(User user);
    CartItemResponseDTO addToCart(User user, CartItemRequestDTO request);
    void removeFromCart(User user, String productId);
    void clearCart(User user);
    void updateCartItem(UUID userId, UUID productId, int quantity);
}
