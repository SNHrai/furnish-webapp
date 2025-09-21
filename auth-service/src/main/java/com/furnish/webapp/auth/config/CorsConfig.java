package com.furnish.webapp.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

/**
 * CRITICAL CORS Configuration
 * This configuration ensures CORS is handled BEFORE Spring Security
 * to prevent OPTIONS preflight failures
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Web MVC CORS configuration - handles at servlet level
     * This is processed BEFORE Spring Security filters
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Allow all origins for development
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .exposedHeaders(
                    "Authorization", 
                    "Content-Type", 
                    "Accept", 
                    "Origin",
                    "Access-Control-Allow-Origin", 
                    "Access-Control-Allow-Credentials",
                    "Set-Cookie"
                )
                .maxAge(3600);
    }

    /**
     * CORS Filter Bean - highest priority
     * This filter runs BEFORE Spring Security
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // CRITICAL: Allow credentials
        config.setAllowCredentials(true);
        
        // CRITICAL: Allow all origins for development (change for production)
        config.addAllowedOriginPattern("*");
        
        // CRITICAL: Allow all headers
        config.addAllowedHeader("*");
        
        // CRITICAL: Allow all methods including OPTIONS
        config.addAllowedMethod("*");
        
        // Expose headers
        config.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Accept", 
            "Origin",
            "Access-Control-Allow-Origin", 
            "Access-Control-Allow-Credentials",
            "Set-Cookie"
        ));
        
        // Cache preflight for 1 hour
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }

    /**
     * CORS Configuration Source for Spring Security
     * This is used by Spring Security's CORS support
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        // Allow all origins for development
        configuration.addAllowedOriginPattern("*");
        
        // Allow all headers
        configuration.addAllowedHeader("*");
        
        // Allow all methods
        configuration.addAllowedMethod("*");
        
        // Expose necessary headers
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Accept", 
            "Origin",
            "Access-Control-Allow-Origin", 
            "Access-Control-Allow-Credentials",
            "Set-Cookie"
        ));
        
        // Cache preflight for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
