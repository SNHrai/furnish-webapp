package com.furnish.webapp.auth.controller;

import com.furnish.webapp.auth.dto.*;
import com.furnish.webapp.auth.service.AuthService;
import com.furnish.webapp.auth.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

/**
 * Authentication REST Controller
 * Provides API endpoints compatible with the existing FastAPI auth interface
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication and management endpoints")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    /**
     * User login endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful", 
                    content = @Content(schema = @Schema(implementation = TokenResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login request received for email: {}", loginRequest.getEmail());
            TokenResponse tokenResponse = authService.login(loginRequest);
            return ResponseEntity.ok(tokenResponse);
        } catch (BadCredentialsException e) {
            logger.warn("Login failed for email: {} - {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Incorrect email or password"));
        } catch (Exception e) {
            logger.error("Login error for email: {} - {}", loginRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Login failed. Please try again."));
        }
    }

    /**
     * User registration endpoint with automatic login
     * POST /api/auth/register
     */
    @PostMapping("/register")
    @Operation(summary = "User Registration", description = "Register new user account and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Registration successful with JWT token", 
                    content = @Content(schema = @Schema(implementation = TokenResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input or user already exists"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        try {
            logger.info("Registration request received for email: {} from origin: {}", 
                       registerRequest.getEmail(), request.getHeader("Origin"));
            logger.info("Request headers: User-Agent={}, Content-Type={}, Referer={}", 
                       request.getHeader("User-Agent"), 
                       request.getHeader("Content-Type"),
                       request.getHeader("Referer"));
            
            // Register the user and get JWT token
            TokenResponse tokenResponse = authService.registerAndLogin(registerRequest);
            logger.info("Registration and auto-login successful for user with email: {}", registerRequest.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(tokenResponse);
        } catch (IllegalArgumentException e) {
            logger.warn("Registration failed for email: {} - {}", registerRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Registration error for email: {} - {}", registerRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Registration failed. Please try again."));
        }
    }

    /**
     * Get current user endpoint
     * GET /api/auth/me
     */
    @GetMapping("/me")
    @Operation(summary = "Get Current User", description = "Get current authenticated user information")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User information retrieved", 
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid or expired token"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractTokenFromHeader(authHeader);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Could not validate credentials"));
            }

            UserResponse userResponse = authService.validateTokenAndGetUser(token);
            return ResponseEntity.ok(userResponse);
        } catch (BadCredentialsException e) {
            logger.warn("Token validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Could not validate credentials"));
        } catch (UsernameNotFoundException e) {
            logger.warn("User not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("User not found"));
        } catch (Exception e) {
            logger.error("Get current user error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get user information"));
        }
    }

    /**
     * Forgot password endpoint
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody AuthService.ForgotPasswordRequest request) {
        try {
            logger.info("Forgot password request received for email: {}", request.getEmail());
            authService.forgotPassword(request);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "If an account with that email exists, we've sent you a password reset link.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Forgot password error for email: {} - {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to process forgot password request"));
        }
    }

    /**
     * Health check endpoint
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "Auth Service");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    /**
     * Debug endpoint for troubleshooting CORS and request issues
     * GET /api/auth/debug
     */
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debug(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> headers = new HashMap<>();
        
        // Collect all headers
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.put(headerName, request.getHeader(headerName));
        }
        
        response.put("method", request.getMethod());
        response.put("requestURL", request.getRequestURL().toString());
        response.put("remoteAddr", request.getRemoteAddr());
        response.put("origin", request.getHeader("Origin"));
        response.put("referer", request.getHeader("Referer"));
        response.put("userAgent", request.getHeader("User-Agent"));
        response.put("headers", headers);
        response.put("timestamp", java.time.Instant.now());
        response.put("message", "Debug endpoint - CORS should be working if you can see this response");
        response.put("corsEnabled", true);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * CORS test endpoint specifically for frontend
     * POST /api/auth/cors-test
     */
    @PostMapping("/cors-test")
    public ResponseEntity<Map<String, Object>> corsTest(@RequestBody(required = false) Map<String, Object> payload, 
                                                        HttpServletRequest request) {
        logger.info("CORS test request received from origin: {}", request.getHeader("Origin"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS is working correctly!");
        response.put("origin", request.getHeader("Origin"));
        response.put("method", request.getMethod());
        response.put("timestamp", java.time.Instant.now());
        response.put("payload", payload);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * CORS preflight test endpoint
     * OPTIONS /api/auth/preflight-test
     */
    @RequestMapping(value = "/preflight-test", method = RequestMethod.OPTIONS)
    public ResponseEntity<Map<String, Object>> preflightTest(HttpServletRequest request) {
        logger.info("OPTIONS preflight request received from origin: {}", request.getHeader("Origin"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "OPTIONS preflight successful!");
        response.put("origin", request.getHeader("Origin"));
        response.put("method", request.getMethod());
        response.put("timestamp", java.time.Instant.now());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Reset password endpoint
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    @Operation(summary = "Reset Password", description = "Reset user password using a valid reset token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Password reset successful"),
        @ApiResponse(responseCode = "400", description = "Invalid or expired token"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            logger.info("Password reset request received for token: {}", request.getToken() != null ? request.getToken().substring(0, Math.min(8, request.getToken().length())) + "..." : "null");
            
            // TODO: Implement actual password reset logic
            // This would typically:
            // 1. Validate the reset token
            // 2. Find the user associated with the token
            // 3. Update the user's password
            // 4. Invalidate the reset token
            
            // For now, just return success for valid-looking requests
            if (request.getToken() == null || request.getToken().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Reset token is required"));
            }
            
            if (request.getNew_password() == null || request.getNew_password().length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("New password must be at least 6 characters long"));
            }
            
            // Simulate token validation (implement actual logic here)
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successful");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Password reset error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to reset password. Please try again."));
        }
    }
    
    /**
     * Token validation endpoint (for inter-service communication)
     * POST /api/auth/validate
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractTokenFromHeader(authHeader);
            if (token == null || !jwtService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid token"));
            }

            String username = jwtService.extractUsername(token);
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);
            String userId = jwtService.extractUserId(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("username", username);
            response.put("email", email);
            response.put("role", role);
            response.put("user_id", userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Token validation error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Token validation failed"));
        }
    }

    /**
     * Extract JWT token from Authorization header
     */
    private String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    /**
     * Create standardized error response
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("detail", message);
        error.put("error", message);
        return error;
    }

    /**
     * Global exception handler for validation errors
     */
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            if (errors.length() > 0) errors.append("; ");
            errors.append(error.getDefaultMessage());
        });
        
        logger.warn("Validation error: {}", errors.toString());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(errors.toString()));
    }
}