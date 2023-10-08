package com.yongheon.backend.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    public static final String ALLOWED_METHOD_NAMES = "GET,HEAD,POST,OPTIONS,PATCH";

    @Value("${front-url}")
    private String front_url;

    @Override
    public void addCorsMappings(final CorsRegistry registry) {
        registry.addMapping("/**")
                .allowCredentials(true)
                .allowedMethods(ALLOWED_METHOD_NAMES.split(","))
                .allowedOriginPatterns("*")
                .maxAge(3600)
                .exposedHeaders("Authorization")
                .allowedHeaders("Authorization", "Accept", "Content-Type");

    }
}