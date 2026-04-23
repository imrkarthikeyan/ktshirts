package com.karthickcloths.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderRequest(
        @NotNull
        Long productId,
        @NotBlank
        String productName,
        @NotBlank
        String color,
        @NotBlank
        String size,
        @Min(1)
        int quantity,
        @Min(1)
        int unitPrice
        ) {

}
