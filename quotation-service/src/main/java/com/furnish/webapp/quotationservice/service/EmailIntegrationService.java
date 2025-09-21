package com.furnish.webapp.quotationservice.service;

import com.furnish.webapp.quotationservice.entity.Quotation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailIntegrationService {
    
    @Value("${email-service.base-url:http://localhost:8081}")
    private String emailServiceBaseUrl;
    
    private final WebClient webClient;
    
    public EmailIntegrationService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
    }
    
    /**
     * Send quotation email via email service
     */
    public boolean sendQuotationEmail(Quotation quotation, String recipientEmail, String recipientName, String message) {
        try {
            Map<String, Object> emailRequest = new HashMap<>();
            emailRequest.put("to", recipientEmail);
            emailRequest.put("subject", "Quotation: " + quotation.getName());
            emailRequest.put("template", "quotation");
            
            Map<String, Object> templateData = new HashMap<>();
            templateData.put("recipientName", recipientName);
            templateData.put("quotationName", quotation.getName());
            templateData.put("message", message);
            templateData.put("quotationId", quotation.getId());
            templateData.put("createdAt", quotation.getCreatedAt().toString());
            templateData.put("status", quotation.getStatus().getValue());
            
            // Add quotation details
            if (quotation.getClientInfo() != null) {
                templateData.putAll(quotation.getClientInfo());
            }
            
            if (quotation.getCalculationData() != null) {
                templateData.put("calculationData", quotation.getCalculationData());
            }
            
            emailRequest.put("templateData", templateData);
            
            // If PDF file exists, include attachment info
            if (quotation.getPdfFilePath() != null) {
                Map<String, String> attachment = new HashMap<>();
                attachment.put("filename", "quotation-" + quotation.getName() + ".pdf");
                attachment.put("path", quotation.getPdfFilePath());
                emailRequest.put("attachment", attachment);
            }
            
            Boolean result = webClient.post()
                    .uri(emailServiceBaseUrl + "/api/email/send")
                    .body(BodyInserters.fromValue(emailRequest))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> (Boolean) response.get("success"))
                    .onErrorResume(WebClientResponseException.class, ex -> {
                        System.err.println("Email service error: " + ex.getMessage());
                        return Mono.just(false);
                    })
                    .block();
            
            return result != null && result;
            
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send notification email
     */
    public boolean sendNotificationEmail(String to, String subject, String message) {
        try {
            Map<String, Object> emailRequest = new HashMap<>();
            emailRequest.put("to", to);
            emailRequest.put("subject", subject);
            emailRequest.put("template", "notification");
            
            Map<String, Object> templateData = new HashMap<>();
            templateData.put("message", message);
            templateData.put("subject", subject);
            
            emailRequest.put("templateData", templateData);
            
            Boolean result = webClient.post()
                    .uri(emailServiceBaseUrl + "/api/email/send")
                    .body(BodyInserters.fromValue(emailRequest))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> (Boolean) response.get("success"))
                    .onErrorResume(WebClientResponseException.class, ex -> {
                        System.err.println("Email service error: " + ex.getMessage());
                        return Mono.just(false);
                    })
                    .block();
            
            return result != null && result;
            
        } catch (Exception e) {
            System.err.println("Failed to send notification email: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Test email service connection
     */
    public boolean isEmailServiceAvailable() {
        try {
            String result = webClient.get()
                    .uri(emailServiceBaseUrl + "/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .onErrorResume(ex -> Mono.just("error"))
                    .block();
            
            return !"error".equals(result);
        } catch (Exception e) {
            return false;
        }
    }
}