package com.furnish.webapp.emailservice.dto;

public class EmailResponse {
    
    private boolean success;
    private String message;
    private String messageId;
    
    // Constructors
    public EmailResponse() {}
    
    public EmailResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public EmailResponse(boolean success, String message, String messageId) {
        this.success = success;
        this.message = message;
        this.messageId = messageId;
    }
    
    // Static factory methods
    public static EmailResponse success(String message) {
        return new EmailResponse(true, message);
    }
    
    public static EmailResponse success(String message, String messageId) {
        return new EmailResponse(true, message, messageId);
    }
    
    public static EmailResponse error(String message) {
        return new EmailResponse(false, message);
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
    
    public String getMessageId() {
        return messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
}
