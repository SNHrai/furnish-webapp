package com.furnish.webapp.quotationservice.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

public class QuotationRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Form data is required")
    private Map<String, Object> formData;
    
    @NotNull(message = "Calculation data is required")
    private Map<String, Object> calculationData;
    
    private Map<String, Object> clientInfo;
    
    private String notes;
    
    // Constructors
    public QuotationRequest() {}
    
    public QuotationRequest(String name, Map<String, Object> formData, Map<String, Object> calculationData) {
        this.name = name;
        this.formData = formData;
        this.calculationData = calculationData;
    }
    
    // Getters and Setters
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
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}