-- MySQL Database Schema for Furnish Web App Quotation Service
-- This script creates the database and table structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS furnish_quotations
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE furnish_quotations;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS quotations;

-- Create quotations table
CREATE TABLE quotations (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    form_data JSON,
    calculation_data JSON,
    client_info JSON,
    status ENUM('draft', 'sent', 'approved', 'rejected') NOT NULL DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    pdf_file_path VARCHAR(512),
    email_sent BOOLEAN DEFAULT FALSE,
    
    -- Indexes for better performance
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_user_status (user_id, status),
    INDEX idx_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
INSERT INTO quotations (
    id, 
    user_id, 
    name, 
    form_data, 
    calculation_data, 
    client_info, 
    status, 
    notes, 
    pdf_file_path, 
    email_sent
) VALUES 
(
    'sample-quotation-001',
    'user-123',
    'Modern Living Room Design',
    JSON_OBJECT(
        'roomType', 'living-room',
        'roomSize', 'large',
        'style', 'modern',
        'budget', 'medium',
        'preferences', JSON_ARRAY('minimalist', 'contemporary')
    ),
    JSON_OBJECT(
        'basePrice', 150000,
        'furnitureCost', 75000,
        'laborCost', 25000,
        'totalPrice', 250000,
        'taxAmount', 45000,
        'finalAmount', 295000
    ),
    JSON_OBJECT(
        'clientName', 'John Doe',
        'email', 'john.doe@example.com',
        'phone', '+91-9876543210',
        'address', 'Mumbai, Maharashtra'
    ),
    'draft',
    'Initial quotation for modern living room with contemporary furniture.',
    NULL,
    FALSE
),
(
    'sample-quotation-002',
    'user-456',
    'Luxury Master Bedroom',
    JSON_OBJECT(
        'roomType', 'bedroom',
        'roomSize', 'medium',
        'style', 'luxury',
        'budget', 'high',
        'preferences', JSON_ARRAY('elegant', 'spacious')
    ),
    JSON_OBJECT(
        'basePrice', 200000,
        'furnitureCost', 150000,
        'laborCost', 50000,
        'totalPrice', 400000,
        'taxAmount', 72000,
        'finalAmount', 472000
    ),
    JSON_OBJECT(
        'clientName', 'Jane Smith',
        'email', 'jane.smith@example.com',
        'phone', '+91-9876543211',
        'address', 'Delhi, India'
    ),
    'sent',
    'Luxury bedroom design with premium finishes and custom furniture.',
    '/pdfs/luxury-bedroom-jane-smith.pdf',
    TRUE
);

-- Create a view for quotation summary
CREATE OR REPLACE VIEW quotation_summary AS
SELECT 
    id,
    user_id,
    name,
    status,
    JSON_UNQUOTE(JSON_EXTRACT(calculation_data, '$.totalPrice')) as total_price,
    JSON_UNQUOTE(JSON_EXTRACT(client_info, '$.clientName')) as client_name,
    JSON_UNQUOTE(JSON_EXTRACT(client_info, '$.email')) as client_email,
    created_at,
    updated_at,
    email_sent
FROM quotations
ORDER BY created_at DESC;

-- Create a stored procedure to get quotations by user and status
DELIMITER //
CREATE PROCEDURE GetUserQuotationsByStatus(
    IN p_user_id VARCHAR(255),
    IN p_status VARCHAR(50)
)
BEGIN
    IF p_status = 'all' THEN
        SELECT * FROM quotations 
        WHERE user_id = p_user_id 
        ORDER BY created_at DESC;
    ELSE
        SELECT * FROM quotations 
        WHERE user_id = p_user_id AND status = p_status 
        ORDER BY created_at DESC;
    END IF;
END //
DELIMITER ;

-- Create a function to calculate total quotations for a user
DELIMITER //
CREATE FUNCTION GetUserQuotationCount(p_user_id VARCHAR(255))
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE quotation_count INT;
    SELECT COUNT(*) INTO quotation_count 
    FROM quotations 
    WHERE user_id = p_user_id;
    RETURN quotation_count;
END //
DELIMITER ;

-- Display created objects
SELECT 'Database and table structure created successfully!' as message;

-- Show table structure
DESCRIBE quotations;

-- Show sample data
SELECT 'Sample quotations:' as info;
SELECT id, name, status, JSON_UNQUOTE(JSON_EXTRACT(client_info, '$.clientName')) as client_name 
FROM quotations;

-- Show database statistics
SELECT 'Database Statistics:' as info;
SELECT 
    COUNT(*) as total_quotations,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_quotations,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_quotations,
    COUNT(CASE WHEN email_sent = TRUE THEN 1 END) as emailed_quotations
FROM quotations;