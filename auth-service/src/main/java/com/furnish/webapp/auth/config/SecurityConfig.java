package com.furnish.webapp.auth.config;

import com.furnish.webapp.auth.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Modern Security Configuration for Authentication Service
 * Configures CORS, password encoding, and security policies using SecurityFilterChain
 */
@Configuration
@EnableWebSecurity
@EnableJpaAuditing
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;
    
    @Autowired
    private CorsFilter corsFilter;

    /**
     * CRITICAL Security Filter Chain Configuration
     * CORS Filter is injected separately with highest precedence
     * This ensures OPTIONS requests are handled before Spring Security
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            // Enable CORS with our configuration source
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            
            // Disable CSRF for REST API
            .csrf(csrf -> csrf.disable())
            
            // Stateless session management
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure authorization rules
            .authorizeRequests()
                // CRITICAL: Allow ALL OPTIONS requests - handled by CORS filter first
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Public auth endpoints
                .antMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register", "/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
                .antMatchers(HttpMethod.GET, "/api/auth/health", "/api/auth/debug").permitAll()
                .antMatchers(HttpMethod.POST, "/api/auth/cors-test").permitAll()
                
                // Swagger/OpenAPI endpoints
                .antMatchers("/api/swagger-ui/**", "/api/docs/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .antMatchers("/swagger-resources/**", "/webjars/**").permitAll()
                
                // Health check endpoint
                .antMatchers("/actuator/health").permitAll()
                
                // H2 Console for development
                .antMatchers("/h2-console/**").permitAll()
                
                // All other requests require authentication
                .anyRequest().authenticated()
            .and()
            
            // Disable frame options for H2 console
            .headers(headers -> headers.frameOptions().disable())
            
            // Add JWT filter after CORS processing
            .addFilterAfter(jwtAuthenticationFilter, CorsFilter.class)
            
            .build();
    }

    /**
     * Password encoder bean using BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

}