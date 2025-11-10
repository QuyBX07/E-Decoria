package com.example.Decoria.controller;

import com.example.Decoria.dto.*;
import com.example.Decoria.entity.User;
import com.example.Decoria.service.CartItemService;
import com.example.Decoria.util.AuthUtils; // ✅ thêm import này
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartItemController {

    private final CartItemService cartItemService;
    private final AuthUtils authUtils; // ✅ inject class tiện ích lấy user

    @GetMapping
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems() {
        User currentUser = authUtils.getCurrentUser(); // ✅ lấy từ token JWT
        return ResponseEntity.ok(cartItemService.getCartItems(currentUser));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemResponseDTO> addToCart(@RequestBody CartItemRequestDTO request) {
        User currentUser = authUtils.getCurrentUser();
        return ResponseEntity.ok(cartItemService.addToCart(currentUser, request));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable String productId) {
        User currentUser = authUtils.getCurrentUser();
        cartItemService.removeFromCart(currentUser, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        User currentUser = authUtils.getCurrentUser();
        cartItemService.clearCart(currentUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCartItem(@RequestBody CartUpdateRequestDTO dto) {
        User currentUser = authUtils.getCurrentUser();
        cartItemService.updateCartItem(currentUser.getId(), dto.getProductId(), dto.getQuantity());
        return ResponseEntity.ok("Cập nhật số lượng thành công");
    }

}
