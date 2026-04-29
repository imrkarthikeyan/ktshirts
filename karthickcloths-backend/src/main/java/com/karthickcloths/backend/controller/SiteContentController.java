package com.karthickcloths.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.karthickcloths.backend.model.SiteContent;
import com.karthickcloths.backend.model.User;
import com.karthickcloths.backend.repository.SiteContentRepository;
import com.karthickcloths.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/site-content")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://trialbytshirt.com",
    "https://www.trialbytshirt.com",
    "https://trailbytshirt.vercel.app"
})
public class SiteContentController {

    private static final Set<String> ALLOWED_KEYS = Set.of("home", "footer", "contact");

    @Autowired
    private SiteContentRepository siteContentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/{key}")
    public ResponseEntity<?> getSiteContent(@PathVariable String key) {
        try {
            String normalizedKey = normalizeAndValidateKey(key);

            SiteContent content = siteContentRepository.findByContentKey(normalizedKey).orElse(null);
            if (content == null || content.getContentJson() == null || content.getContentJson().isBlank()) {
                return ResponseEntity.ok(Map.of("success", true, "data", Map.of()));
            }

            Map<String, Object> parsed = objectMapper.readValue(content.getContentJson(), new TypeReference<>() {
            });
            return ResponseEntity.ok(Map.of("success", true, "data", parsed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{key}")
    public ResponseEntity<?> updateSiteContent(
            @PathVariable String key,
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request
    ) {
        try {
            String normalizedKey = normalizeAndValidateKey(key);

            User user = getCurrentUser(request);
            if (!user.isAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Admin access required"));
            }

            String json = objectMapper.writeValueAsString(payload == null ? Map.of() : payload);

            SiteContent content = siteContentRepository.findByContentKey(normalizedKey).orElseGet(SiteContent::new);
            content.setContentKey(normalizedKey);
            content.setContentJson(json);
            siteContentRepository.save(content);

            return ResponseEntity.ok(Map.of("success", true, "message", "Content updated", "data", payload == null ? Map.of() : payload));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    private String normalizeAndValidateKey(String key) throws Exception {
        String normalizedKey = key == null ? "" : key.trim().toLowerCase();
        if (!ALLOWED_KEYS.contains(normalizedKey)) {
            throw new Exception("Invalid site content key");
        }
        return normalizedKey;
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
