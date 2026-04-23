package com.karthickcloths.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.stream.Stream;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174,https://ktshirts.vercel.app,https://*.vercel.app}")
    private String allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] defaultOrigins = new String[]{
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://ktshirts.vercel.app",
                    "https://*.vercel.app"
                };

                String[] origins = Stream.concat(
                        Arrays.stream(defaultOrigins),
                        Arrays.stream(allowedOrigins.split(","))
                )
                        .map(String::trim)
                        .map(origin -> origin.replace("\"", ""))
                        .filter(origin -> !origin.isEmpty())
                        .distinct()
                        .toArray(String[]::new);

                registry.addMapping("/api/**")
                        .allowedOriginPatterns(origins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
