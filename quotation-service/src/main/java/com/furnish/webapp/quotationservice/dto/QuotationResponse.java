package com.furnish.webapp.quotationservice.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class QuotationResponse {
    
    private String id;
    private String name;
    private Map<String, Object> formData;
    private Map<String, Object> calculationData;
    private Map<String, Object> clientInfo;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String pdfFilePath;
    private Boolean emailSent;
    
    // Constructors
    public QuotationResponse() {}
    
    public QuotationResponse(String id, String name, String status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    // Success response factory method
    public static ApiResponse<QuotationResponse> success(QuotationResponse data) {
        return new ApiResponse<>(true, "Operation successful", data);
    }
    
    // Error response factory method
    public static ApiResponse<QuotationResponse> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Map<String, Object> getFormData() {
        return formData;
    }
    
    public void setFormData(Map<String, Object> formData) {
        this.formData = formData;
    }
    
    public Map<String, Object> getCalculationData() {
        return calculationData;
    }
    
    public void setCalculationData(Map<String, Object> calculationData) {
        this.calculationData = calculationData;
    }
    
    public Map<String, Object> getClientInfo() {
        return clientInfo;
    }
    
    public void setClientInfo(Map<String, Object> clientInfo) {
        this.clientInfo = clientInfo;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getPdfFilePath() {
        return pdfFilePath;
    }
    
    public void setPdfFilePath(String pdfFilePath) {
        this.pdfFilePath = pdfFilePath;
    }
    
    public Boolean getEmailSent() {
        return emailSent;
    }
    
    public void setEmailSent(Boolean emailSent) {
        this.emailSent = emailSent;
    }
}

// Generic API Response wrapper
class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    
    public ApiResponse() {}
    
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
}