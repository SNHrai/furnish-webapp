package com.furnish.webapp.quotationservice.service;

import com.furnish.webapp.quotationservice.entity.Quotation;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;

@Service
public class PdfService {
    
    @Value("${app.pdf.storage-path:/tmp/quotations}")
    private String pdfStoragePath;
    
    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(26, 54, 93); // Deep Navy Blue
    private static final DeviceRgb ACCENT_COLOR = new DeviceRgb(212, 175, 55); // Luxury Gold
    private static final DeviceRgb WARM_COLOR = new DeviceRgb(192, 86, 33); // Warm Orange
    
    private final NumberFormat currencyFormat;
    
    public PdfService() {
        this.currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
    }
    
    /**
     * Generate PDF for quotation and return as byte array
     */
    public byte[] generateQuotationPdf(Quotation quotation) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDoc = new PdfDocument(writer);
             Document document = new Document(pdfDoc, PageSize.A4)) {
            
            // Set up fonts
            PdfFont titleFont = PdfFontFactory.createFont();
            PdfFont headerFont = PdfFontFactory.createFont();
            PdfFont bodyFont = PdfFontFactory.createFont();
            
            // Add content to PDF
            addHeader(document, titleFont);
            addQuotationDetails(document, quotation, headerFont, bodyFont);
            addCalculationBreakdown(document, quotation, headerFont, bodyFont);
            addTermsAndConditions(document, bodyFont);
            addFooter(document, bodyFont);
            
        } catch (Exception e) {
            throw new IOException("Failed to generate PDF", e);
        }
        
        return outputStream.toByteArray();
    }
    
    /**
     * Generate and save PDF file to disk
     */
    public String generateAndSavePdf(Quotation quotation) throws IOException {
        byte[] pdfContent = generateQuotationPdf(quotation);
        
        // Ensure directory exists
        File directory = new File(pdfStoragePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Generate filename
        String filename = "quotation-" + quotation.getId() + "-" + System.currentTimeMillis() + ".pdf";
        String filePath = pdfStoragePath + "/" + filename;
        
        // Save file
        try (FileOutputStream fileOutputStream = new FileOutputStream(filePath)) {
            fileOutputStream.write(pdfContent);
        }
        
        return filePath;
    }
    
    private void addHeader(Document document, PdfFont titleFont) {
        // Company Logo/Header
        Paragraph companyHeader = new Paragraph("ELEGANT HOME")
                .setFont(titleFont)
                .setFontSize(24)
                .setFontColor(PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        
        Paragraph tagline = new Paragraph("Luxury Interior Design Solutions")
                .setFontSize(12)
                .setFontColor(ACCENT_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        
        document.add(companyHeader);
        document.add(tagline);
        
        // Horizontal line
        document.add(new Paragraph().setHeight(1)
                .setBackgroundColor(PRIMARY_COLOR)
                .setMarginBottom(20));
    }
    
    private void addQuotationDetails(Document document, Quotation quotation, PdfFont headerFont, PdfFont bodyFont) {
        // Quotation title
        Paragraph quotationTitle = new Paragraph("INTERIOR DESIGN QUOTATION")
                .setFont(headerFont)
                .setFontSize(18)
                .setFontColor(PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(quotationTitle);
        
        // Quotation details table
        Table detailsTable = new Table(new float[]{1, 2, 1, 2});
        detailsTable.setWidth(UnitValue.createPercentValue(100));
        
        // Add quotation basic info
        addTableRow(detailsTable, "Quotation ID:", quotation.getId().toUpperCase(), bodyFont);
        addTableRow(detailsTable, "Project Name:", quotation.getName(), bodyFont);
        addTableRow(detailsTable, "Date:", quotation.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), bodyFont);
        addTableRow(detailsTable, "Status:", quotation.getStatus().getValue().toUpperCase(), bodyFont);
        
        // Add form data details
        Map<String, Object> formData = quotation.getFormData();
        if (formData != null) {
            addTableRow(detailsTable, "Room Type:", formatRoomType((String) formData.get("roomType")), bodyFont);
            addTableRow(detailsTable, "Room Size:", formatRoomSize((String) formData.get("roomSize")), bodyFont);
            addTableRow(detailsTable, "Design Style:", formatStyle((String) formData.get("style")), bodyFont);
            addTableRow(detailsTable, "Budget Range:", formatBudget((String) formData.get("budget")), bodyFont);
        }
        
        document.add(detailsTable);
        document.add(new Paragraph().setMarginBottom(20));
    }
    
    private void addCalculationBreakdown(Document document, Quotation quotation, PdfFont headerFont, PdfFont bodyFont) {
        // Calculation breakdown
        Paragraph breakdownTitle = new Paragraph("PRICE BREAKDOWN")
                .setFont(headerFont)
                .setFontSize(16)
                .setFontColor(PRIMARY_COLOR)
                .setMarginBottom(15);
        document.add(breakdownTitle);
        
        Map<String, Object> calculation = quotation.getCalculationData();
        if (calculation != null) {
            Table breakdownTable = new Table(new float[]{3, 1});
            breakdownTable.setWidth(UnitValue.createPercentValue(100));
            
            // Base price
            Object basePrice = calculation.get("basePrice");
            if (basePrice != null) {
                addPriceRow(breakdownTable, "Base Price", ((Number) basePrice).doubleValue(), bodyFont);
            }
            
            // Furniture costs
            Object furnitureCost = calculation.get("furnitureCost");
            if (furnitureCost != null) {
                addPriceRow(breakdownTable, "Furniture & Accessories", ((Number) furnitureCost).doubleValue(), bodyFont);
            }
            
            // Total
            Object totalPrice = calculation.get("totalPrice");
            if (totalPrice != null) {
                // Add separator line
                breakdownTable.addCell(new Cell(1, 2).add(new Paragraph())
                        .setBorderTop(new SolidBorder(ColorConstants.BLACK, 1))
                        .setBorderBottom(new SolidBorder(ColorConstants.BLACK, 1)));
                
                Cell totalLabelCell = new Cell().add(new Paragraph("TOTAL AMOUNT")
                        .setFont(headerFont)
                        .setFontColor(WARM_COLOR)
                        .setFontSize(14));
                
                Cell totalValueCell = new Cell().add(new Paragraph(currencyFormat.format(((Number) totalPrice).doubleValue()))
                        .setFont(headerFont)
                        .setFontColor(WARM_COLOR)
                        .setFontSize(14)
                        .setTextAlignment(TextAlignment.RIGHT));
                
                breakdownTable.addCell(totalLabelCell);
                breakdownTable.addCell(totalValueCell);
            }
            
            document.add(breakdownTable);
        }
        
        document.add(new Paragraph().setMarginBottom(20));
    }
    
    private void addTermsAndConditions(Document document, PdfFont bodyFont) {
        Paragraph termsTitle = new Paragraph("TERMS & CONDITIONS")
                .setFont(bodyFont)
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR)
                .setMarginBottom(10);
        document.add(termsTitle);
        
        String[] terms = {
                "1. This quotation is valid for 30 days from the date of generation.",
                "2. Final pricing may vary based on detailed site survey and material selection.",
                "3. 25% advance payment required to initiate the project.",
                "4. Estimated timeline: 6-12 weeks from project commencement.",
                "5. All materials and workmanship come with a 1-year warranty.",
                "6. Changes to the scope of work may result in additional charges.",
                "7. Client approval required before proceeding with any modifications."
        };
        
        for (String term : terms) {
            document.add(new Paragraph(term)
                    .setFont(bodyFont)
                    .setFontSize(10)
                    .setMarginBottom(5));
        }
        
        document.add(new Paragraph().setMarginBottom(15));
    }
    
    private void addFooter(Document document, PdfFont bodyFont) {
        // Company contact information
        Table footerTable = new Table(new float[]{1, 1, 1});
        footerTable.setWidth(UnitValue.createPercentValue(100));
        
        Cell phoneCell = new Cell().add(new Paragraph("📞 +91 98765 43210")
                .setFont(bodyFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER));
        
        Cell emailCell = new Cell().add(new Paragraph("✉️ hello@eleganthome.com")
                .setFont(bodyFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER));
        
        Cell websiteCell = new Cell().add(new Paragraph("🌐 www.eleganthome.com")
                .setFont(bodyFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER));
        
        footerTable.addCell(phoneCell);
        footerTable.addCell(emailCell);
        footerTable.addCell(websiteCell);
        
        document.add(footerTable);
        
        // Thank you note
        document.add(new Paragraph("Thank you for choosing Elegant Home. We look forward to creating your dream space!")
                .setFont(bodyFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ACCENT_COLOR)
                .setMarginTop(20));
    }
    
    private void addTableRow(Table table, String label, String value, PdfFont font) {
        table.addCell(new Cell().add(new Paragraph(label).setFont(font).setFontSize(10).setBold()));
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "N/A").setFont(font).setFontSize(10)));
    }
    
    private void addPriceRow(Table table, String item, double amount, PdfFont font) {
        table.addCell(new Cell().add(new Paragraph(item).setFont(font).setFontSize(10)));
        table.addCell(new Cell().add(new Paragraph(currencyFormat.format(amount))
                .setFont(font)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT)));
    }
    
    // Helper methods for formatting
    private String formatRoomType(String roomType) {
        if (roomType == null) return "N/A";
        return roomType.replace("-", " ")
                .replace("living-room", "Living Room")
                .replace("bedroom", "Master Bedroom")
                .replace("kitchen", "Kitchen")
                .replace("bathroom", "Bathroom")
                .replace("dining", "Dining Room")
                .replace("office", "Home Office")
                .replace("whole-home", "Whole Home");
    }
    
    private String formatRoomSize(String roomSize) {
        if (roomSize == null) return "N/A";
        return roomSize.replace("small", "Small (< 200 sq ft)")
                .replace("medium", "Medium (200-400 sq ft)")
                .replace("large", "Large (400-600 sq ft)")
                .replace("xl", "Extra Large (> 600 sq ft)");
    }
    
    private String formatStyle(String style) {
        if (style == null) return "N/A";
        return style.replace("modern", "Modern Luxury")
                .replace("traditional", "Classic Traditional")
                .replace("contemporary", "Contemporary Chic")
                .replace("minimalist", "Minimalist Zen")
                .replace("luxury", "Ultra Luxury")
                .replace("transitional", "Transitional Blend");
    }
    
    private String formatBudget(String budget) {
        if (budget == null) return "N/A";
        return budget.replace("standard", "Standard Premium")
                .replace("luxury", "Luxury Collection")
                .replace("ultra", "Ultra Luxury")
                .replace("bespoke", "Bespoke Excellence");
    }
}