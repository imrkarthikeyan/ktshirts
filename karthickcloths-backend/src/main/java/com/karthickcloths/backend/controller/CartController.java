package com.karthickcloths.backend.controller;

import com.karthickcloths.backend.dto.CartItemRequest;
import com.karthickcloths.backend.dto.CartItemResponse;
import com.karthickcloths.backend.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5174")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest cartItemRequest, HttpServletRequest request) {
        try {
            Object userIdObj = request.getAttribute("userId");
            if (userIdObj == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Unauthorized - Please login to add items to cart"));
            }

            Long userId = (Long) userIdObj;
            CartItemResponse response = cartService.addToCart(userId, cartItemRequest);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Item added to cart");
            result.put("data", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/items")
    public ResponseEntity<?> getCartItems(HttpServletRequest request) {
        try {
            Object userIdObj = request.getAttribute("userId");
            if (userIdObj == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Unauthorized - Please login"));
            }

            Long userId = (Long) userIdObj;
            List<CartItemResponse> items = cartService.getCartItems(userId);
            int total = cartService.getCartTotal(userId);

            Map<String, Object> result = new HashMap<>();
            result.put("items", items);
            result.put("total", total);
            result.put("itemCount", items.size());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> request,
            HttpServletRequest httpRequest) {
        try {
            Object userIdObj = httpRequest.getAttribute("userId");
            if (userIdObj == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Unauthorized"));
            }

            int quantity = request.get("quantity");
            CartItemResponse response = cartService.updateCartItem(cartItemId, quantity);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Cart item updated");
            result.put("data", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartItemId, HttpServletRequest request) {
        try {
            Object userIdObj = request.getAttribute("userId");
            if (userIdObj == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Unauthorized"));
            }

            cartService.removeCartItem(cartItemId);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Item removed from cart");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        try {
            Object userIdObj = request.getAttribute("userId");
            if (userIdObj == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Unauthorized"));
            }

            Long userId = (Long) userIdObj;
            cartService.clearCart(userId);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Cart cleared");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    public static class ApiResponse {

        public boolean success;
        public String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}
