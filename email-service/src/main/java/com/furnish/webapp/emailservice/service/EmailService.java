package com.furnish.webapp.emailservice.service;

import com.furnish.webapp.emailservice.dto.EmailRequest;
import com.furnish.webapp.emailservice.dto.EmailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Map;
import java.util.UUID;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.email.default-from-email:noreply@furnish-webapp.com}")
    private String defaultFromEmail;

    @Value("${app.email.default-from-name:Elegant Home}")
    private String defaultFromName;

    public EmailResponse sendTemplatedEmail(EmailRequest emailRequest) {
        try {
            String messageId = UUID.randomUUID().toString();
            
            // Process the template
            Context context = new Context();
            if (emailRequest.getTemplateVariables() != null) {
                context.setVariables(emailRequest.getTemplateVariables());
            }
            
            String htmlContent = templateEngine.process(emailRequest.getTemplateName(), context);
            
            // Create and send email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());
            helper.setText(htmlContent, true);
            
            // Set from address
            String fromEmail = emailRequest.getFromEmail() != null ? emailRequest.getFromEmail() : defaultFromEmail;
            String fromName = emailRequest.getFromName() != null ? emailRequest.getFromName() : defaultFromName;
            
            helper.setFrom(fromEmail, fromName);
            
            // Set message ID for tracking
            message.setHeader("Message-ID", messageId);
            
            mailSender.send(message);
            
            return EmailResponse.success("Email sent successfully", messageId);
            
        } catch (MessagingException e) {
            return EmailResponse.error("Failed to send email: " + e.getMessage());
        } catch (Exception e) {
            return EmailResponse.error("Unexpected error: " + e.getMessage());
        }
    }

    public EmailResponse sendWelcomeEmail(String toEmail, String userName) {
        EmailRequest request = new EmailRequest();
        request.setTo(toEmail);
        request.setSubject("Welcome to Elegant Home - Your Interior Design Journey Begins!");
        request.setTemplateName("welcome");
        
        Map<String, Object> variables = Map.of(
            "userName", userName,
            "companyName", "Elegant Home",
            "supportEmail", "support@furnish-webapp.com",
            "websiteUrl", "https://furnish-webapp.com"
        );
        
        request.setTemplateVariables(variables);
        
        return sendTemplatedEmail(request);
    }

    public EmailResponse sendQuotationEmail(String toEmail, String userName, Map<String, Object> quotationData) {
        EmailRequest request = new EmailRequest();
        request.setTo(toEmail);
        request.setSubject("Your Interior Design Quotation from Elegant Home");
        request.setTemplateName("quotation");
        
        Map<String, Object> variables = Map.of(
            "userName", userName,
            "quotationData", quotationData,
            "companyName", "Elegant Home",
            "supportEmail", "support@furnish-webapp.com",
            "websiteUrl", "https://furnish-webapp.com"
        );
        
        request.setTemplateVariables(variables);
        
        return sendTemplatedEmail(request);
    }

    public EmailResponse sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        EmailRequest request = new EmailRequest();
        request.setTo(toEmail);
        request.setSubject("Password Reset Request - Elegant Home");
        request.setTemplateName("password-reset");
        
        Map<String, Object> variables = Map.of(
            "userName", userName,
            "resetToken", resetToken,
            "resetUrl", "https://furnish-webapp.com/reset-password?token=" + resetToken,
            "companyName", "Elegant Home",
            "supportEmail", "support@furnish-webapp.com"
        );
        
        request.setTemplateVariables(variables);
        
        return sendTemplatedEmail(request);
    }
}
