package com.furnish.webapp.auth.service;

import com.furnish.webapp.auth.dto.*;
import com.furnish.webapp.auth.entity.User;
import com.furnish.webapp.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Authentication Service - Handles user authentication, registration, and user management
 */
@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Authenticate user login
     */
    public TokenResponse login(LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        
        // Find user by email
        Optional<User> userOpt = userRepository.findActiveUserByEmail(loginRequest.getEmail());
        if (!userOpt.isPresent()) {
            logger.warn("Login failed: User not found for email: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            logger.warn("Login failed: Invalid password for user: {}", user.getUsername());
            throw new BadCredentialsException("Invalid email or password");
        }

        // Update last login
        user.updateLastLogin();
        userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user);
        
        logger.info("Login successful for user: {}", user.getUsername());
        return new TokenResponse(token, jwtService.getExpirationTime());
    }

    /**
     * Register new user
     */
    public UserResponse register(RegisterRequest registerRequest) {
        logger.info("Registration attempt for email: {}", registerRequest.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmailOrUsername(registerRequest.getEmail(), registerRequest.getUsername())) {
            logger.warn("Registration failed: User already exists with email: {} or username: {}", 
                       registerRequest.getEmail(), registerRequest.getUsername());
            throw new IllegalArgumentException("Email or username already registered");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        // Save user
        User savedUser = userRepository.save(user);
        
        logger.info("Registration successful for user: {}", savedUser.getUsername());
        return convertToUserResponse(savedUser);
    }

    /**
     * Register new user and automatically login (return JWT token)
     */
    public TokenResponse registerAndLogin(RegisterRequest registerRequest) {
        logger.info("Registration with auto-login attempt for email: {}", registerRequest.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmailOrUsername(registerRequest.getEmail(), registerRequest.getUsername())) {
            logger.warn("Registration failed: User already exists with email: {} or username: {}", 
                       registerRequest.getEmail(), registerRequest.getUsername());
            throw new IllegalArgumentException("Email or username already registered");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        // Save user
        User savedUser = userRepository.save(user);
        
        // Update last login timestamp
        savedUser.updateLastLogin();
        userRepository.save(savedUser);
        
        // Generate JWT token for immediate login
        String token = jwtService.generateToken(savedUser);
        
        logger.info("Registration and auto-login successful for user: {}", savedUser.getUsername());
        return new TokenResponse(token, jwtService.getExpirationTime());
    }

    /**
     * Get user by username
     */
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return convertToUserResponse(user);
    }

    /**
     * Get user by email
     */
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        
        return convertToUserResponse(user);
    }

    /**
     * Get user by ID
     */
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
        
        return convertToUserResponse(user);
    }

    /**
     * Validate JWT token and get user
     */
    public UserResponse validateTokenAndGetUser(String token) {
        if (!jwtService.validateToken(token)) {
            throw new BadCredentialsException("Invalid or expired token");
        }

        String username = jwtService.extractUsername(token);
        return getUserByUsername(username);
    }

    /**
     * Update user profile
     */
    public UserResponse updateUser(String username, UserUpdateRequest updateRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Update fields if provided
        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getPhone() != null) {
            user.setPhone(updateRequest.getPhone());
        }

        User updatedUser = userRepository.save(user);
        logger.info("User profile updated for: {}", username);
        
        return convertToUserResponse(updatedUser);
    }

    /**
     * Forgot password - generate reset token (placeholder implementation)
     */
    public void forgotPassword(ForgotPasswordRequest request) {
        logger.info("Forgot password request for email: {}", request.getEmail());
        
        // Check if user exists
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        // Always return success to prevent email enumeration attacks
        // In a real implementation, you would send an email with a reset link
        logger.info("Forgot password request processed for email: {}", request.getEmail());
    }

    /**
     * Convert User entity to UserResponse DTO
     */
    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().toString().toLowerCase());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        response.setLastLogin(user.getLastLogin());
        
        return response;
    }

    // Additional DTOs needed

    /**
     * User update request DTO
     */
    public static class UserUpdateRequest {
        private String fullName;
        private String phone;

        // Constructors, getters, and setters
        public UserUpdateRequest() {}

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }

    /**
     * Forgot password request DTO
     */
    public static class ForgotPasswordRequest {
        private String email;

        public ForgotPasswordRequest() {}

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}