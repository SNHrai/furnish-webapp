package com.furnish.webapp.emailservice.controller;

import com.furnish.webapp.emailservice.dto.EmailRequest;
import com.furnish.webapp.emailservice.dto.EmailResponse;
import com.furnish.webapp.emailservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8000"})
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<EmailResponse> sendTemplatedEmail(@Valid @RequestBody EmailRequest emailRequest) {
        EmailResponse response = emailService.sendTemplatedEmail(emailRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/send/welcome")
    public ResponseEntity<EmailResponse> sendWelcomeEmail(@RequestBody Map<String, String> payload) {
        String toEmail = payload.get("email");
        String userName = payload.get("userName");
        
        if (toEmail == null || userName == null) {
            return ResponseEntity.badRequest().body(
                EmailResponse.error("Missing required fields: email and userName")
            );
        }
        
        EmailResponse response = emailService.sendWelcomeEmail(toEmail, userName);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/send/quotation")
    public ResponseEntity<EmailResponse> sendQuotationEmail(@RequestBody Map<String, Object> payload) {
        String toEmail = (String) payload.get("email");
        String userName = (String) payload.get("userName");
        @SuppressWarnings("unchecked")
        Map<String, Object> quotationData = (Map<String, Object>) payload.get("quotationData");
        
        if (toEmail == null || userName == null || quotationData == null) {
            return ResponseEntity.badRequest().body(
                EmailResponse.error("Missing required fields: email, userName, and quotationData")
            );
        }
        
        EmailResponse response = emailService.sendQuotationEmail(toEmail, userName, quotationData);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/send/password-reset")
    public ResponseEntity<EmailResponse> sendPasswordResetEmail(@RequestBody Map<String, String> payload) {
        String toEmail = payload.get("email");
        String userName = payload.get("userName");
        String resetToken = payload.get("resetToken");
        
        if (toEmail == null || userName == null || resetToken == null) {
            return ResponseEntity.badRequest().body(
                EmailResponse.error("Missing required fields: email, userName, and resetToken")
            );
        }
        
        EmailResponse response = emailService.sendPasswordResetEmail(toEmail, userName, resetToken);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Email Service",
            "version", "1.0.0"
        ));
    }
}
