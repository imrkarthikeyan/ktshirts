package com.karthickcloths.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomTshirtAdminReplyDto {

    private String adminResponse;
    private String status;
    private Integer price;
    private String designPreviewUrl;
}
