package com.karthickcloths.backend.model;

import java.util.List;

public record MenProduct(
        Long id,
        String name,
        String brand,
        String description,
        int originalPrice,
        int offerPrice,
        int discountPercent,
        String defaultColor,
        List<String> availableColors,
        List<String> sizes,
        String fabric,
        String fit,
        String collar,
        String sleeve,
        String seller,
        String deliveryBy,
        double sellerRating,
        String ratingText,
        List<String> images
        ) {

}
