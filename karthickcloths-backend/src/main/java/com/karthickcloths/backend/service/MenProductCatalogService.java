package com.karthickcloths.backend.service;

import com.karthickcloths.backend.model.MenProduct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenProductCatalogService {

    private final List<MenProduct> menProducts = List.of(
            new MenProduct(
                    1L,
                    "FATTY MOUSE Men Regular Fit Solid Spread Collar Casual Shirt",
                    "FATTY MOUSE",
                    "Premium cotton casual shirt with clean spread collar and regular fit for all-day comfort.",
                    799,
                    268,
                    66,
                    "Black",
                    List.of("Black", "White", "Olive"),
                    List.of("M", "L", "XL", "2XL"),
                    "100% Cotton",
                    "Regular Fit",
                    "Spread Collar",
                    "Full Sleeve",
                    "SNWARIYAENTERPRISES",
                    "23 Apr, Thu",
                    3.9,
                    "5 years with Flipkart",
                    List.of(
                            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1583743814966-8936f37f4f4f?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80"
                    )
            ),
            new MenProduct(
                    2L,
                    "Urban Minimal Crew Neck T-Shirt",
                    "TRIAL BY TSHIRT",
                    "Soft bio-washed cotton t-shirt with minimalist styling and smooth finish.",
                    999,
                    399,
                    60,
                    "White",
                    List.of("White", "Black", "Navy"),
                    List.of("M", "L", "XL", "2XL"),
                    "Bio-Washed Cotton",
                    "Regular Fit",
                    "Round Neck",
                    "Half Sleeve",
                    "SNWARIYAENTERPRISES",
                    "23 Apr, Thu",
                    3.9,
                    "5 years with Flipkart",
                    List.of(
                            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=80"
                    )
            ),
            new MenProduct(
                    3L,
                    "Classic Drop Shoulder Oversized Tee",
                    "TRIAL BY TSHIRT",
                    "Oversized drop-shoulder t-shirt with breathable knit and modern streetwear cut.",
                    1199,
                    499,
                    58,
                    "Black",
                    List.of("Black", "Beige", "Grey"),
                    List.of("M", "L", "XL", "2XL"),
                    "Premium Jersey",
                    "Oversized",
                    "Ribbed Crew",
                    "Half Sleeve",
                    "SNWARIYAENTERPRISES",
                    "23 Apr, Thu",
                    3.9,
                    "5 years with Flipkart",
                    List.of(
                            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
                            "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=80"
                    )
            )
    );

    public List<MenProduct> getAllProducts() {
        return menProducts;
    }

    public MenProduct getProductById(Long id) {
        return menProducts.stream()
                .filter(product -> product.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }
}

