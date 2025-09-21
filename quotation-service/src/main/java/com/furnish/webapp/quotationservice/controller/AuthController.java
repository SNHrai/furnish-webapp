package com.furnish.webapp.quotationservice.controller;

import com.furnish.webapp.quotationservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password are required"));
            }
            
            // Use the existing AuthService to validate credentials
            // This will call the Python auth service configured in your application.properties
            String token = authService.validateCredentials(username, password);
            
            if (token != null) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "username", username
                ));
            } else {
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid credentials"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Authentication service unavailable: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid token format"));
            }
            
            String token = authHeader.substring(7);
            String username = authService.validateToken(token);
            
            if (username != null) {
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "username", username
                ));
            } else {
                return ResponseEntity.status(401)
                    .body(Map.of("valid", false, "error", "Invalid token"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Token validation failed: " + e.getMessage()));
        }
    }
}