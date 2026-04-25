package com.karthickcloths.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomTshirtRequestCreateDto {

    private String fullName;
    private String contactEmail;
    private String phoneNumber;
    private String whatsappNumber;
    private String tshirtType;
    private Integer quantity;
    private String sizePreference;
    private String colorPreference;
    private String printText;
    private String designDescription;
    private String designIdea;
    private String imageUrl;
    private String notes;
}
