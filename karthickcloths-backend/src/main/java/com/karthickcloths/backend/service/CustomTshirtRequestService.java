package com.karthickcloths.backend.service;

import com.karthickcloths.backend.dto.CartItemRequest;
import com.karthickcloths.backend.dto.CartItemResponse;
import com.karthickcloths.backend.dto.CustomTshirtAdminReplyDto;
import com.karthickcloths.backend.dto.CustomTshirtRequestCreateDto;
import com.karthickcloths.backend.model.CustomTshirtRequest;
import com.karthickcloths.backend.model.User;
import com.karthickcloths.backend.repository.CustomTshirtRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class CustomTshirtRequestService {

    private static final Pattern HTTP_URL_PATTERN = Pattern.compile("^https?://.+", Pattern.CASE_INSENSITIVE);

    @Autowired
    private CustomTshirtRequestRepository customTshirtRequestRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private CartService cartService;

    @Value("${app.mail.from:${app.mail.username:}}")
    private String mailFrom;

    public CustomTshirtRequest createRequest(User user, CustomTshirtRequestCreateDto requestDto) throws Exception {
        if (requestDto.getTshirtType() == null || requestDto.getTshirtType().isBlank()) {
            throw new Exception("T-shirt type is required");
        }
        if (requestDto.getQuantity() == null || requestDto.getQuantity() <= 0) {
            throw new Exception("Quantity must be at least 1");
        }
        String designDescription = firstNonBlank(requestDto.getDesignDescription(), requestDto.getDesignIdea());
        if (designDescription == null || designDescription.isBlank()) {
            throw new Exception("Please provide your design details");
        }

        CustomTshirtRequest request = new CustomTshirtRequest();
        request.setOrderId(generateOrderId());
        request.setUserId(user.getId());
        request.setUserEmail(user.getEmail());
        request.setContactEmail(trimOrNull(requestDto.getContactEmail()));
        request.setFullName(safeValue(requestDto.getFullName(), user.getFullName()));
        request.setPhoneNumber(safeValue(requestDto.getPhoneNumber(), user.getPhoneNumber()));
        request.setWhatsappNumber(safeValue(requestDto.getWhatsappNumber(), user.getPhoneNumber()));
        request.setTshirtType(requestDto.getTshirtType().trim());
        request.setQuantity(requestDto.getQuantity());
        request.setSizePreference(trimOrNull(requestDto.getSizePreference()));
        request.setColorPreference(trimOrNull(requestDto.getColorPreference()));
        request.setPrintText(trimOrNull(requestDto.getPrintText()));
        request.setDesignIdea(designDescription.trim());
        request.setImageUrl(normalizeImageReference(requestDto.getImageUrl()));
        request.setNotes(trimOrNull(requestDto.getNotes()));
        request.setStatus("PENDING");
        request.setPrice(0);

        CustomTshirtRequest savedRequest = customTshirtRequestRepository.save(request);
        sendEmailIfPossible(resolveNotificationEmail(savedRequest),
                "Custom edition request received: " + savedRequest.getOrderId(),
                buildStatusEmail(savedRequest));
        return savedRequest;
    }

    public List<CustomTshirtRequest> getRequestsForUser(Long userId) {
        return customTshirtRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<CustomTshirtRequest> trackRequestsByEmail(String email) {
        return customTshirtRequestRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(email);
    }

    public Optional<CustomTshirtRequest> getRequestByOrderId(String orderId) {
        return customTshirtRequestRepository.findByOrderId(orderId);
    }

    public List<CustomTshirtRequest> getAllRequests(String statusFilter) {
        if (statusFilter == null || statusFilter.isBlank()) {
            return customTshirtRequestRepository.findAllByOrderByCreatedAtDesc();
        }

        return customTshirtRequestRepository.findByStatusOrderByCreatedAtDesc(statusFilter.trim().toUpperCase(Locale.ROOT));
    }

    public CustomTshirtRequest respondToRequest(Long requestId, CustomTshirtAdminReplyDto replyDto) throws Exception {
        CustomTshirtRequest request = customTshirtRequestRepository.findById(requestId)
                .orElseThrow(() -> new Exception("Request not found"));

        if (replyDto.getAdminResponse() == null || replyDto.getAdminResponse().isBlank()) {
            throw new Exception("Admin response is required");
        }

        String normalizedDesignPreviewUrl = normalizeImageReference(replyDto.getDesignPreviewUrl());
        String normalizedStatus = normalizeStatus(replyDto.getStatus());

        if ("REJECTED".equals(normalizedStatus)) {
            request.setDesignPreviewUrl(null);
        } else if ("REVIEWED".equals(normalizedStatus) || "APPROVED".equals(normalizedStatus)) {
            if (normalizedDesignPreviewUrl == null) {
                throw new Exception("A design preview URL is required when sharing a design with the customer");
            }
            request.setDesignPreviewUrl(normalizedDesignPreviewUrl);
        } else {
            request.setDesignPreviewUrl(normalizedDesignPreviewUrl);
        }

        request.setAdminResponse(replyDto.getAdminResponse().trim());
        request.setStatus(normalizedStatus);
        if (replyDto.getPrice() != null && replyDto.getPrice() >= 0) {
            request.setPrice(replyDto.getPrice());
        }
        request.setRepliedAt(LocalDateTime.now());
        CustomTshirtRequest updatedRequest = customTshirtRequestRepository.save(request);
        String subject = "Custom edition update for " + updatedRequest.getOrderId();
        if ("REVIEWED".equalsIgnoreCase(updatedRequest.getStatus())) {
            subject = "Trail By T Shirt preview ready: " + updatedRequest.getOrderId();
        } else if ("REJECTED".equalsIgnoreCase(updatedRequest.getStatus())) {
            subject = "Custom edition request update: " + updatedRequest.getOrderId();
        }
        sendEmailIfPossible(resolveNotificationEmail(updatedRequest),
                subject,
                buildStatusEmail(updatedRequest));
        return updatedRequest;
    }

    public CartItemResponse confirmRequestAndConvertToCart(String orderId, User user) throws Exception {
        CustomTshirtRequest request = customTshirtRequestRepository.findByOrderId(orderId)
                .orElseThrow(() -> new Exception("Request not found"));

        if (!request.getUserId().equals(user.getId())) {
            throw new Exception("You can only confirm your own custom requests");
        }
        if (!"REVIEWED".equalsIgnoreCase(request.getStatus())) {
            throw new Exception("This request is not ready for customer confirmation");
        }
        if (request.getDesignPreviewUrl() == null || request.getDesignPreviewUrl().isBlank()) {
            throw new Exception("No design preview has been shared yet");
        }

        request.setCustomerDecision("CONFIRMED");
        request.setCustomerDecisionAt(LocalDateTime.now());
        request.setStatus("APPROVED");
        customTshirtRequestRepository.save(request);

        CartItemResponse cartItem = convertApprovedRequestToCart(orderId, user);
        sendEmailIfPossible(resolveNotificationEmail(request),
                "Order confirmed and moved to cart: " + request.getOrderId(),
                buildConfirmedAndAddedToCartEmail(request));

        return cartItem;
    }

    public CustomTshirtRequest cancelRequest(String orderId, User user) throws Exception {
        CustomTshirtRequest request = customTshirtRequestRepository.findByOrderId(orderId)
                .orElseThrow(() -> new Exception("Request not found"));

        if (!request.getUserId().equals(user.getId())) {
            throw new Exception("You can only cancel your own custom requests");
        }
        if (!"REVIEWED".equalsIgnoreCase(request.getStatus())) {
            throw new Exception("This request can no longer be canceled");
        }

        request.setCustomerDecision("CANCELED");
        request.setCustomerDecisionAt(LocalDateTime.now());
        request.setStatus("CANCELED");
        CustomTshirtRequest updatedRequest = customTshirtRequestRepository.save(request);
        sendEmailIfPossible(resolveNotificationEmail(updatedRequest),
                "Custom edition request canceled: " + updatedRequest.getOrderId(),
                buildCancellationEmail(updatedRequest));
        return updatedRequest;
    }

    public CartItemResponse convertApprovedRequestToCart(String orderId, User user) throws Exception {
        CustomTshirtRequest request = customTshirtRequestRepository.findByOrderId(orderId)
                .orElseThrow(() -> new Exception("Request not found"));

        if (!request.getUserId().equals(user.getId())) {
            throw new Exception("You can only checkout your own custom requests");
        }
        if (!"APPROVED".equalsIgnoreCase(request.getStatus())) {
            throw new Exception("Only approved requests can be converted to cart");
        }
        if (Boolean.TRUE.equals(request.getConvertedToCart())) {
            throw new Exception("This request has already been converted to cart");
        }

        CartItemRequest cartItemRequest = new CartItemRequest();
        cartItemRequest.setProductId(request.getId());
        cartItemRequest.setProductName("Custom Edition - " + request.getOrderId());
        cartItemRequest.setBrand("Karthick Cloths");
        cartItemRequest.setUnitPrice(Optional.ofNullable(request.getPrice()).orElse(0));
        cartItemRequest.setQuantity(request.getQuantity());
        cartItemRequest.setSelectedColor(firstNonBlank(request.getColorPreference(), "Custom"));
        cartItemRequest.setSelectedSize(firstNonBlank(request.getSizePreference(), "Custom"));
        // Only use the admin shared preview image for the cart item.
        cartItemRequest.setProductImage(firstNonBlank(request.getDesignPreviewUrl(), null));

        CartItemResponse cartItemResponse = cartService.addToCart(user.getId(), cartItemRequest);
        request.setConvertedToCart(true);
        request.setConvertedAt(LocalDateTime.now());
        customTshirtRequestRepository.save(request);
        return cartItemResponse;
    }

    private String safeValue(String preferred, String fallback) {
        if (preferred != null && !preferred.isBlank()) {
            return preferred.trim();
        }
        if (fallback != null && !fallback.isBlank()) {
            return fallback.trim();
        }
        return "";
    }

    private String trimOrNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeImageReference(String imageUrl) throws Exception {
        String normalized = trimOrNull(imageUrl);
        if (normalized == null) {
            return null;
        }

        if (normalized.regionMatches(true, 0, "data:", 0, 5)) {
            throw new Exception("Image upload is disabled. Please provide an image URL.");
        }
        if (!HTTP_URL_PATTERN.matcher(normalized).matches()) {
            throw new Exception("Please provide a valid image URL starting with http:// or https://");
        }

        return normalized;
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.isBlank()) {
            return first.trim();
        }
        if (second != null && !second.isBlank()) {
            return second.trim();
        }
        return null;
    }

    private String normalizeStatus(String status) throws Exception {
        String normalized = status == null || status.isBlank() ? "REVIEWED" : status.trim().toUpperCase(Locale.ROOT);
        List<String> allowed = List.of("PENDING", "REVIEWED", "APPROVED", "REJECTED", "CANCELED");
        if (!allowed.contains(normalized)) {
            throw new Exception("Invalid status");
        }
        return normalized;
    }

    private String generateOrderId() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
        return "CE-" + datePart + "-" + randomPart;
    }

    private String resolveNotificationEmail(CustomTshirtRequest request) {
        if (request.getContactEmail() != null && !request.getContactEmail().isBlank()) {
            return request.getContactEmail().trim();
        }
        return request.getUserEmail();
    }

    private void sendEmailIfPossible(String recipient, String subject, String body) {
        if (mailSender == null || recipient == null || recipient.isBlank()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipient);
            if (mailFrom != null && !mailFrom.isBlank()) {
                message.setFrom(mailFrom);
            }
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ignored) {
            // Best-effort notification only.
        }
    }

    private String buildStatusEmail(CustomTshirtRequest request) {
        StringBuilder body = new StringBuilder();
        body.append("Hello ").append(request.getFullName()).append(",\n\n");
        body.append("Your custom edition request has been updated by Trail By T Shirt Team.\n");
        body.append("Order ID: ").append(request.getOrderId()).append("\n");
        body.append("Status: ").append(request.getStatus()).append("\n");
        body.append("Price: ").append(request.getPrice() == null ? 0 : request.getPrice()).append("\n");
        if (request.getDesignPreviewUrl() != null && !request.getDesignPreviewUrl().isBlank()) {
            body.append("Design Preview: ").append(request.getDesignPreviewUrl()).append("\n");
        }
        if (request.getAdminResponse() != null && !request.getAdminResponse().isBlank()) {
            body.append("Admin Response: ").append(request.getAdminResponse()).append("\n");
        }

        if ("REVIEWED".equalsIgnoreCase(request.getStatus()) && request.getDesignPreviewUrl() != null && !request.getDesignPreviewUrl().isBlank()) {
            body.append("\nTrail By T Shirt Team has shared your preview image.\n");
            body.append("Please review this image in Track Orders and confirm or cancel your order.\n");
        }
        if ("REJECTED".equalsIgnoreCase(request.getStatus())) {
            body.append("\nWe are sorry, this design could not be built.\n");
            body.append("Please check the admin response and submit a revised request if needed.\n");
        }

        body.append("\nTrack your request in the app using the Track Orders page.");
        return body.toString();
    }

    private String buildCancellationEmail(CustomTshirtRequest request) {
        StringBuilder body = new StringBuilder();
        body.append("Hello ").append(request.getFullName()).append(",\n\n");
        body.append("Your custom edition request was canceled as requested.\n");
        body.append("Order ID: ").append(request.getOrderId()).append("\n");
        body.append("If you want a different design, please submit a new request anytime.");
        return body.toString();
    }

    private String buildConfirmedAndAddedToCartEmail(CustomTshirtRequest request) {
        StringBuilder body = new StringBuilder();
        body.append("Hello ").append(request.getFullName()).append(",\n\n");
        body.append("You confirmed the preview image shared by Trail By T Shirt Team.\n");
        body.append("Order ID: ").append(request.getOrderId()).append("\n");
        if (request.getDesignPreviewUrl() != null && !request.getDesignPreviewUrl().isBlank()) {
            body.append("Confirmed Preview Image: ").append(request.getDesignPreviewUrl()).append("\n");
        }
        body.append("Your confirmed preview product has been added to cart for payment and delivery.\n");
        body.append("Please open the Cart page to continue checkout.");
        return body.toString();
    }
}
