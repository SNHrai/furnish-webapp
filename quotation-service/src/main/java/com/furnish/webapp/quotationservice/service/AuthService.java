package com.furnish.webapp.quotationservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class AuthService {
    
    @Value("${python-auth.base-url:http://localhost:8001}")
    private String pythonAuthBaseUrl;
    
    @Value("${jwt.secret:your-secret-key}")
    private String jwtSecret;
    
    private final WebClient webClient;
    
    public AuthService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
    }
    
    /**
     * Validate JWT token with Python auth service
     */
    public Mono<UserInfo> validateTokenWithPythonService(String token) {
        return webClient.get()
                .uri(pythonAuthBaseUrl + "/api/auth/me")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(Map.class)
                .map(this::mapToUserInfo)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    if (ex.getRawStatusCode() == 401) {
                        return Mono.empty(); // Invalid token
                    }
                    return Mono.error(new RuntimeException("Auth service unavailable", ex));
                });
    }
    
    /**
     * Extract user ID from JWT token (fallback method)
     */
    public String extractUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
            
            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }
    
    /**
     * Check if token is expired (local check)
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
            
            return claims.getExpiration().before(new java.util.Date());
        } catch (Exception e) {
            return true; // Consider invalid tokens as expired
        }
    }
    
    /**
     * Validate credentials with Python auth service and return JWT token
     */
    public String validateCredentials(String username, String password) {
        try {
            Map<String, String> loginRequest = Map.of(
                "username", username,
                "password", password
            );
            
            Map<String, Object> response = webClient.post()
                    .uri(pythonAuthBaseUrl + "/api/auth/login")
                    .bodyValue(loginRequest)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            
            if (response != null && response.containsKey("token")) {
                return (String) response.get("token");
            }
            
            return null;
        } catch (WebClientResponseException ex) {
            if (ex.getRawStatusCode() == 401) {
                return null; // Invalid credentials
            }
            throw new RuntimeException("Auth service unavailable: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            throw new RuntimeException("Authentication failed: " + ex.getMessage(), ex);
        }
    }
    
    /**
     * Validate token and return username
     */
    public String validateToken(String token) {
        try {
            // First try with Python auth service
            UserInfo userInfo = validateTokenWithPythonService(token).block();
            if (userInfo != null) {
                return userInfo.getUsername();
            }
            
            // Fallback to local JWT validation
            if (!isTokenExpired(token)) {
                return extractUserIdFromToken(token);
            }
            
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    private UserInfo mapToUserInfo(Map<String, Object> userMap) {
        UserInfo userInfo = new UserInfo();
        userInfo.setId((String) userMap.get("id"));
        userInfo.setEmail((String) userMap.get("email"));
        userInfo.setUsername((String) userMap.get("username"));
        userInfo.setFullName((String) userMap.get("full_name"));
        userInfo.setRole((String) userMap.get("role"));
        userInfo.setActive((Boolean) userMap.get("is_active"));
        return userInfo;
    }
    
    public static class UserInfo {
        private String id;
        private String email;
        private String username;
        private String fullName;
        private String role;
        private Boolean active;
        
        // Constructors
        public UserInfo() {}
        
        public UserInfo(String id, String email, String username) {
            this.id = id;
            this.email = email;
            this.username = username;
        }
        
        // Getters and Setters
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getFullName() {
            return fullName;
        }
        
        public void setFullName(String fullName) {
            this.fullName = fullName;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public Boolean getActive() {
            return active;
        }
        
        public void setActive(Boolean active) {
            this.active = active;
        }
    }
}