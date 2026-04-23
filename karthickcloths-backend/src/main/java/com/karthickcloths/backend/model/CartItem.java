package com.karthickcloths.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private int unitPrice;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String selectedColor;

    @Column(nullable = false)
    private String selectedSize;

    @Column(nullable = true)
    private String productImage;

    @Column(name = "added_at")
    private java.time.LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = java.time.LocalDateTime.now();
    }
}
