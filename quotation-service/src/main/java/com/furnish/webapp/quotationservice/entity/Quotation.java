package com.furnish.webapp.quotationservice.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "quotations")
public class Quotation {
    
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(255)")
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Type(type = "json")
    @Column(name = "form_data", columnDefinition = "JSON")
    private Map<String, Object> formData;
    
    @Type(type = "json")
    @Column(name = "calculation_data", columnDefinition = "JSON")
    private Map<String, Object> calculationData;
    
    @Type(type = "json")
    @Column(name = "client_info", columnDefinition = "JSON")
    private Map<String, Object> clientInfo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private QuotationStatus status = QuotationStatus.DRAFT;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "pdf_file_path")
    private String pdfFilePath;
    
    @Column(name = "email_sent")
    private Boolean emailSent = false;
    
    // Enum for quotation status
    public enum QuotationStatus {
        DRAFT("draft"),
        SENT("sent"),
        APPROVED("approved"),
        REJECTED("rejected");
        
        private final String value;
        
        QuotationStatus(String value) {
            this.value = value;
        }
        
        @JsonValue
        public String getValue() {
            return value;
        }
        
        @JsonCreator
        public static QuotationStatus fromValue(String value) {
            for (QuotationStatus status : QuotationStatus.values()) {
                if (status.value.equals(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Invalid QuotationStatus value: " + value);
        }
    }
    
    // Constructors
    public Quotation() {}
    
    public Quotation(String userId, String name, Map<String, Object> formData, Map<String, Object> calculationData) {
        this.userId = userId;
        this.name = name;
        this.formData = formData;
        this.calculationData = calculationData;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
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
    
    public QuotationStatus getStatus() {
        return status;
    }
    
    public void setStatus(QuotationStatus status) {
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