package com.karthickcloths.backend.service;

import com.karthickcloths.backend.dto.OrderRequest;
import com.karthickcloths.backend.dto.WhatsappOrderResponse;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class WhatsappOrderService {

    private static final String DELIVERY_PHONE = "9025758149";

    public WhatsappOrderResponse createWhatsappOrder(OrderRequest request) {
        int total = request.unitPrice() * request.quantity();

        String message = "Hello Karthick Cloths, I want to order:\n"
                + "Product: " + request.productName() + "\n"
                + "Product ID: " + request.productId() + "\n"
                + "Color: " + request.color() + "\n"
                + "Size: " + request.size() + "\n"
                + "Quantity: " + request.quantity() + "\n"
                + "Unit Price: Rs." + request.unitPrice() + "\n"
                + "Total: Rs." + total + "\n"
                + "Please confirm availability and delivery.";

        String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
        String whatsappUrl = "https://wa.me/" + DELIVERY_PHONE + "?text=" + encodedMessage;

        return new WhatsappOrderResponse(whatsappUrl, message);
    }
}
