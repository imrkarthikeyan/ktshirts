package com.karthickcloths.backend.service;

import com.karthickcloths.backend.dto.CartItemRequest;
import com.karthickcloths.backend.dto.CartItemResponse;
import com.karthickcloths.backend.model.CartItem;
import com.karthickcloths.backend.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItemResponse addToCart(Long userId, CartItemRequest cartItemRequest) throws Exception {
        // Check if item with same product, color, and size already exists
        Optional<CartItem> existingItem = cartItemRepository
                .findByUserIdAndProductIdAndSelectedColorAndSelectedSize(
                        userId,
                        cartItemRequest.getProductId(),
                        cartItemRequest.getSelectedColor(),
                        cartItemRequest.getSelectedSize()
                );

        CartItem cartItem;
        if (existingItem.isPresent()) {
            // Update quantity if item already exists
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartItemRequest.getQuantity());
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setUserId(userId);
            cartItem.setProductId(cartItemRequest.getProductId());
            cartItem.setProductName(cartItemRequest.getProductName());
            cartItem.setBrand(cartItemRequest.getBrand());
            cartItem.setUnitPrice(cartItemRequest.getUnitPrice());
            cartItem.setQuantity(cartItemRequest.getQuantity());
            cartItem.setSelectedColor(cartItemRequest.getSelectedColor());
            cartItem.setSelectedSize(cartItemRequest.getSelectedSize());
            cartItem.setProductImage(cartItemRequest.getProductImage());
        }

        CartItem savedItem = cartItemRepository.save(cartItem);
        return convertToResponse(savedItem);
    }

    public List<CartItemResponse> getCartItems(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        return cartItems.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public CartItemResponse updateCartItem(Long cartItemId, int quantity) throws Exception {
        Optional<CartItem> itemOptional = cartItemRepository.findById(cartItemId);
        if (itemOptional.isEmpty()) {
            throw new Exception("Cart item not found");
        }

        CartItem cartItem = itemOptional.get();
        if (quantity <= 0) {
            cartItemRepository.deleteById(cartItemId);
            throw new Exception("Item removed from cart");
        }

        cartItem.setQuantity(quantity);
        CartItem updatedItem = cartItemRepository.save(cartItem);
        return convertToResponse(updatedItem);
    }

    public void removeCartItem(Long cartItemId) throws Exception {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new Exception("Cart item not found");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    public int getCartTotal(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        return cartItems.stream()
                .mapToInt(item -> item.getUnitPrice() * item.getQuantity())
                .sum();
    }

    private CartItemResponse convertToResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setProductId(cartItem.getProductId());
        response.setProductName(cartItem.getProductName());
        response.setBrand(cartItem.getBrand());
        response.setUnitPrice(cartItem.getUnitPrice());
        response.setQuantity(cartItem.getQuantity());
        response.setSelectedColor(cartItem.getSelectedColor());
        response.setSelectedSize(cartItem.getSelectedSize());
        response.setProductImage(cartItem.getProductImage());
        response.setTotalPrice(cartItem.getUnitPrice() * cartItem.getQuantity());
        return response;
    }
}
