package com.example.Decoria.service.impl;

import com.example.Decoria.dto.*;
import com.example.Decoria.entity.*;
import com.example.Decoria.exception.NotFoundException;
import com.example.Decoria.mapper.CartItemMapper;
import com.example.Decoria.repository.*;
import com.example.Decoria.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartItemMapper cartItemMapper;

    @Override
    public List<CartItemResponseDTO> getCartItems(User user) {
        return cartItemRepository.findByUser(user)
                .stream()
                .map(cartItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CartItemResponseDTO addToCart(User user, CartItemRequestDTO request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));

        // kiểm tra sản phẩm đã tồn tại trong giỏ chưa
        List<CartItem> items = cartItemRepository.findByUser(user);
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(request.getProductId())) {
                item.setQuantity(item.getQuantity() + request.getQuantity());
                return cartItemMapper.toDTO(cartItemRepository.save(item));
            }
        }

        CartItem newItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();

        return cartItemMapper.toDTO(cartItemRepository.save(newItem));
    }

    @Override
    public void removeFromCart(User user, String productId) {
        cartItemRepository.deleteByUserAndProduct_Id(user, UUID.fromString(productId));
    }

    @Override
    public void clearCart(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(items);
    }

    public void updateCartItem(UUID userId, UUID productId, int quantity) {
        CartItem cartItem = cartItemRepository.findByUser_IdAndProduct_Id(userId, productId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

    }

}
