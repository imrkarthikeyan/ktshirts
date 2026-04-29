package com.karthickcloths.backend.controller;

import com.karthickcloths.backend.dto.CartItemResponse;
import com.karthickcloths.backend.dto.CustomTshirtAdminReplyDto;
import com.karthickcloths.backend.dto.CustomTshirtRequestCreateDto;
import com.karthickcloths.backend.model.CustomTshirtRequest;
import com.karthickcloths.backend.model.User;
import com.karthickcloths.backend.repository.UserRepository;
import com.karthickcloths.backend.service.CustomTshirtRequestService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/custom-edition")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://trialbytshirt.com",
    "https://www.trialbytshirt.com",
    "https://trailbytshirt.vercel.app"
})
public class CustomTshirtRequestController {

    @Autowired
    private CustomTshirtRequestService customTshirtRequestService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/requests")
    public ResponseEntity<?> createRequest(@RequestBody CustomTshirtRequestCreateDto requestDto, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            CustomTshirtRequest createdRequest = customTshirtRequestService.createRequest(user, requestDto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Custom request submitted successfully",
                    "data", createdRequest
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/requests/mine")
    public ResponseEntity<?> getMyRequests(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            List<CustomTshirtRequest> requests = customTshirtRequestService.getRequestsForUser(user.getId());
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/tracking")
    public ResponseEntity<?> trackCustomRequest(@RequestParam(required = false) String orderId,
            @RequestParam(required = false) String email) {
        try {
            if (orderId != null && !orderId.isBlank()) {
                CustomTshirtRequest request = customTshirtRequestService.getRequestByOrderId(orderId.trim())
                        .orElseThrow(() -> new Exception("Order not found"));
                return ResponseEntity.ok(Map.of("success", true, "data", request));
            }

            if (email != null && !email.isBlank()) {
                List<CustomTshirtRequest> requests = customTshirtRequestService.trackRequestsByEmail(email.trim());
                return ResponseEntity.ok(Map.of("success", true, "data", requests));
            }

            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Order ID or email is required"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/requests/admin")
    public ResponseEntity<?> getAllRequestsForAdmin(@RequestParam(required = false) String status, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            if (!user.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", "Admin access required"));
            }

            List<CustomTshirtRequest> requests = customTshirtRequestService.getAllRequests(status);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/requests/admin/{orderId}")
    public ResponseEntity<?> getAdminRequestByOrderId(@PathVariable String orderId, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            if (!user.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", "Admin access required"));
            }

            CustomTshirtRequest requestItem = customTshirtRequestService.getRequestByOrderId(orderId)
                    .orElseThrow(() -> new Exception("Request not found"));
            return ResponseEntity.ok(Map.of("success", true, "data", requestItem));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/requests/{requestId}/respond")
    public ResponseEntity<?> respondToRequest(@PathVariable Long requestId,
            @RequestBody CustomTshirtAdminReplyDto replyDto,
            HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            if (!user.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", "Admin access required"));
            }

            CustomTshirtRequest updatedRequest = customTshirtRequestService.respondToRequest(requestId, replyDto);
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{orderId}/checkout")
    public ResponseEntity<?> convertApprovedRequestToCart(@PathVariable String orderId, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            CartItemResponse cartItem = customTshirtRequestService.convertApprovedRequestToCart(orderId, user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Custom request added to cart for checkout",
                    "data", cartItem
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{orderId}/confirm")
    public ResponseEntity<?> confirmRequest(@PathVariable String orderId, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            CartItemResponse cartItem = customTshirtRequestService.confirmRequestAndConvertToCart(orderId, user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Custom design confirmed and moved to checkout",
                    "data", cartItem
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/requests/{orderId}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable String orderId, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            CustomTshirtRequest updatedRequest = customTshirtRequestService.cancelRequest(orderId, user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Custom request canceled successfully",
                    "data", updatedRequest
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    private User getCurrentUser(HttpServletRequest request) throws Exception {
        Object userIdObj = request.getAttribute("userId");
        if (userIdObj == null) {
            throw new Exception("Unauthorized - Please login");
        }

        Long userId = (Long) userIdObj;
        return userRepository.findById(userId).orElseThrow(() -> new Exception("User not found"));
    }
}
