package com.karthickcloths.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "custom_tshirt_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomTshirtRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 40)
    private String orderId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userEmail;

    private String contactEmail;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String whatsappNumber;

    @Column(nullable = false)
    private String tshirtType;

    @Column(nullable = false)
    private Integer quantity;

    private String sizePreference;
    private String colorPreference;

    @Column(length = 600)
    private String printText;

    @Column(length = 1200)
    private String designIdea;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(length = 1200)
    private String notes;

    @Column(nullable = false)
    private String status;

    @Column
    private Integer price;

    @Column
    private Boolean convertedToCart = false;

    private LocalDateTime convertedAt;

    @Column(length = 2000)
    private String adminResponse;

    @Column(columnDefinition = "TEXT")
    private String designPreviewUrl;

    @Column(length = 20)
    private String customerDecision;

    private LocalDateTime customerDecisionAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime repliedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null || status.isBlank()) {
            status = "PENDING";
        } else {
            status = status.trim().toUpperCase();
        }
        if (convertedToCart == null) {
            convertedToCart = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status != null) {
            status = status.trim().toUpperCase();
        }
        if (customerDecision != null) {
            customerDecision = customerDecision.trim().toUpperCase();
        }
    }
}
