package com.furnish.webapp.quotationservice.service;

import com.furnish.webapp.quotationservice.dto.QuotationRequest;
import com.furnish.webapp.quotationservice.dto.QuotationResponse;
import com.furnish.webapp.quotationservice.entity.Quotation;
import com.furnish.webapp.quotationservice.repository.QuotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuotationService {
    
    @Autowired
    private QuotationRepository quotationRepository;
    
    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private EmailIntegrationService emailIntegrationService;
    
    /**
     * Create a new quotation
     */
    public QuotationResponse createQuotation(String userId, QuotationRequest request) {
        try {
            Quotation quotation = new Quotation();
            quotation.setUserId(userId);
            quotation.setName(request.getName());
            quotation.setFormData(request.getFormData());
            quotation.setCalculationData(request.getCalculationData());
            quotation.setClientInfo(request.getClientInfo());
            quotation.setNotes(request.getNotes());
            
            Quotation savedQuotation = quotationRepository.save(quotation);
            
            return mapToResponse(savedQuotation);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create quotation: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get quotation by ID
     */
    public Optional<QuotationResponse> getQuotationById(String quotationId, String userId) {
        Optional<Quotation> quotation = quotationRepository.findByIdAndUserId(quotationId, userId);
        return quotation.map(this::mapToResponse);
    }
    
    /**
     * Get all quotations for a user
     */
    public List<QuotationResponse> getUserQuotations(String userId) {
        List<Quotation> quotations = quotationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return quotations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get paginated quotations for a user
     */
    public Page<QuotationResponse> getUserQuotationsPaginated(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quotation> quotations = quotationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return quotations.map(this::mapToResponse);
    }
    
    /**
     * Update quotation
     */
    public Optional<QuotationResponse> updateQuotation(String quotationId, String userId, QuotationRequest request) {
        Optional<Quotation> existingQuotation = quotationRepository.findByIdAndUserId(quotationId, userId);
        
        if (existingQuotation.isPresent()) {
            Quotation quotation = existingQuotation.get();
            quotation.setName(request.getName());
            quotation.setFormData(request.getFormData());
            quotation.setCalculationData(request.getCalculationData());
            quotation.setClientInfo(request.getClientInfo());
            quotation.setNotes(request.getNotes());
            
            Quotation updatedQuotation = quotationRepository.save(quotation);
            return Optional.of(mapToResponse(updatedQuotation));
        }
        
        return Optional.empty();
    }
    
    /**
     * Delete quotation
     */
    public boolean deleteQuotation(String quotationId, String userId) {
        Optional<Quotation> quotation = quotationRepository.findByIdAndUserId(quotationId, userId);
        if (quotation.isPresent()) {
            quotationRepository.delete(quotation.get());
            return true;
        }
        return false;
    }
    
    /**
     * Generate and download PDF
     */
    public ResponseEntity<byte[]> downloadQuotationPdf(String quotationId, String userId) {
        Optional<Quotation> quotationOpt = quotationRepository.findByIdAndUserId(quotationId, userId);
        
        if (!quotationOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            Quotation quotation = quotationOpt.get();
            byte[] pdfContent = pdfService.generateQuotationPdf(quotation);
            
            String filename = "quotation-" + quotation.getName().replaceAll("[^a-zA-Z0-9]", "-") + ".pdf";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfContent.length);
            
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }
    
    /**
     * Save PDF file and return path
     */
    public String savePdfFile(String quotationId, String userId) {
        Optional<Quotation> quotationOpt = quotationRepository.findByIdAndUserId(quotationId, userId);
        
        if (!quotationOpt.isPresent()) {
            throw new RuntimeException("Quotation not found");
        }
        
        try {
            Quotation quotation = quotationOpt.get();
            String filePath = pdfService.generateAndSavePdf(quotation);
            
            // Update quotation with PDF file path
            quotation.setPdfFilePath(filePath);
            quotationRepository.save(quotation);
            
            return filePath;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save PDF: " + e.getMessage(), e);
        }
    }
    
    /**
     * Update quotation status
     */
    public Optional<QuotationResponse> updateQuotationStatus(String quotationId, String userId, Quotation.QuotationStatus status) {
        Optional<Quotation> quotationOpt = quotationRepository.findByIdAndUserId(quotationId, userId);
        
        if (quotationOpt.isPresent()) {
            Quotation quotation = quotationOpt.get();
            quotation.setStatus(status);
            
            Quotation updatedQuotation = quotationRepository.save(quotation);
            return Optional.of(mapToResponse(updatedQuotation));
        }
        
        return Optional.empty();
    }
    
    /**
     * Send quotation via email
     */
    public boolean sendQuotationByEmail(String quotationId, String userId, String recipientEmail, String recipientName, String message) {
        Optional<Quotation> quotationOpt = quotationRepository.findByIdAndUserId(quotationId, userId);
        
        if (!quotationOpt.isPresent()) {
            return false;
        }
        
        try {
            Quotation quotation = quotationOpt.get();
            
            // Generate PDF if not already generated
            if (quotation.getPdfFilePath() == null) {
                savePdfFile(quotationId, userId);
            }
            
            // Send email via email service
            boolean emailSent = emailIntegrationService.sendQuotationEmail(
                quotation, recipientEmail, recipientName, message
            );
            
            if (emailSent) {
                quotation.setEmailSent(true);
                quotation.setStatus(Quotation.QuotationStatus.SENT);
                quotationRepository.save(quotation);
            }
            
            return emailSent;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to send quotation email: " + e.getMessage(), e);
        }
    }
    
    /**
     * Search quotations by name
     */
    public List<QuotationResponse> searchQuotations(String userId, String searchTerm) {
        List<Quotation> quotations = quotationRepository.findByUserIdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(userId, searchTerm);
        return quotations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get quotations count for user
     */
    public long getQuotationCount(String userId) {
        return quotationRepository.countByUserId(userId);
    }
    
    /**
     * Get quotations by status
     */
    public List<QuotationResponse> getQuotationsByStatus(String userId, Quotation.QuotationStatus status) {
        List<Quotation> quotations = quotationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        return quotations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private QuotationResponse mapToResponse(Quotation quotation) {
        QuotationResponse response = new QuotationResponse();
        response.setId(quotation.getId());
        response.setName(quotation.getName());
        response.setFormData(quotation.getFormData());
        response.setCalculationData(quotation.getCalculationData());
        response.setClientInfo(quotation.getClientInfo());
        response.setStatus(quotation.getStatus().getValue());
        response.setNotes(quotation.getNotes());
        response.setCreatedAt(quotation.getCreatedAt());
        response.setUpdatedAt(quotation.getUpdatedAt());
        response.setPdfFilePath(quotation.getPdfFilePath());
        response.setEmailSent(quotation.getEmailSent());
        
        return response;
    }
}