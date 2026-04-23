package com.karthickcloths.backend.controller;

import com.karthickcloths.backend.model.MenProduct;
import com.karthickcloths.backend.service.MenProductCatalogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products/men")
public class MenProductController {

    private final MenProductCatalogService menProductCatalogService;

    public MenProductController(MenProductCatalogService menProductCatalogService) {
        this.menProductCatalogService = menProductCatalogService;
    }

    @GetMapping
    public ResponseEntity<List<MenProduct>> getMenProducts() {
        return ResponseEntity.ok(menProductCatalogService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMenProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(menProductCatalogService.getProductById(id));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(exception.getMessage()));
        }
    }

    private record ErrorResponse(String message) {

    }
}
