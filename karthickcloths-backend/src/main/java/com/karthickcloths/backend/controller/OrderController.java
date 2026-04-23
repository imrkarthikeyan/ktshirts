package com.karthickcloths.backend.controller;

import com.karthickcloths.backend.dto.OrderRequest;
import com.karthickcloths.backend.dto.WhatsappOrderResponse;
import com.karthickcloths.backend.service.WhatsappOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final WhatsappOrderService whatsappOrderService;

    public OrderController(WhatsappOrderService whatsappOrderService) {
        this.whatsappOrderService = whatsappOrderService;
    }

    @PostMapping("/whatsapp-link")
    public ResponseEntity<WhatsappOrderResponse> createWhatsappOrderLink(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(whatsappOrderService.createWhatsappOrder(request));
    }
}
