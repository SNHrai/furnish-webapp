package com.furnish.webapp.auth.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request DTO for password reset
 */
public class ResetPasswordRequest {
    
    @NotBlank(message = "Reset token is required")
    private String token;
    
    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @JsonProperty("new_password")
    private String new_password;
    
    // Default constructor
    public ResetPasswordRequest() {}
    
    // Constructor
    public ResetPasswordRequest(String token, String new_password) {
        this.token = token;
        this.new_password = new_password;
    }
    
    // Getters and setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getNew_password() {
        return new_password;
    }
    
    public void setNew_password(String new_password) {
        this.new_password = new_password;
    }
    
    @Override
    public String toString() {
        return "ResetPasswordRequest{" +
                "token='" + (token != null ? token.substring(0, Math.min(8, token.length())) + "..." : "null") + '\'' +
                ", new_password='[PROTECTED]'" +
                '}';
    }
}