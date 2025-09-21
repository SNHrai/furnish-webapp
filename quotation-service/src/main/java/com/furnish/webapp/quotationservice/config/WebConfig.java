package com.furnish.webapp.quotationservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS configuration is now handled by SecurityConfig
    // This class can be used for other MVC configurations if needed
}
