package com.karthickcloths.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {

    private Long productId;
    private String productName;
    private String brand;
    private int unitPrice;
    private int quantity;
    private String selectedColor;
    private String selectedSize;
    private String productImage;
}
