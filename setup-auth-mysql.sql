-- MySQL Database Schema for Furnish Web App Auth Service
-- This script creates the authentication database and user table structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS furnish_auth_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE furnish_auth_db;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS users;

-- Create users table for authentication
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'DESIGNER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    -- Indexes for better performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_email_active (email, is_active),
    INDEX idx_username_active (username, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample admin user for testing (password: admin123)
-- Password hash generated with BCrypt for 'admin123'
INSERT INTO users (
    username, 
    email, 
    full_name, 
    phone, 
    password_hash, 
    role, 
    is_active
) VALUES 
(
    'admin',
    'admin@eleganthome.com',
    'System Administrator',
    '+91-9876543210',
    '$2a$10$xHWnvz.qB5TQs8KJtTgKCOqJhEkN7mX.Mg8G5fJr4cNq3pR5iS4cG', -- admin123
    'ADMIN',
    TRUE
),
(
    'testuser',
    'test@example.com',
    'Test User',
    '+91-9876543211',
    '$2a$10$xHWnvz.qB5TQs8KJtTgKCOqJhEkN7mX.Mg8G5fJr4cNq3pR5iS4cG', -- admin123
    'CUSTOMER',
    TRUE
);

-- Create a view for active users
CREATE OR REPLACE VIEW active_users AS
SELECT 
    id,
    username,
    email,
    full_name,
    phone,
    role,
    created_at,
    updated_at,
    last_login
FROM users
WHERE is_active = TRUE
ORDER BY created_at DESC;

-- Create stored procedure to find active user by email
DELIMITER //
CREATE PROCEDURE FindActiveUserByEmail(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT * FROM users 
    WHERE email = p_email AND is_active = TRUE;
END //
DELIMITER ;

-- Create stored procedure to check if email or username exists
DELIMITER //
CREATE PROCEDURE CheckUserExists(
    IN p_email VARCHAR(100),
    IN p_username VARCHAR(50)
)
BEGIN
    SELECT 
        COUNT(*) as user_count,
        SUM(CASE WHEN email = p_email THEN 1 ELSE 0 END) as email_exists,
        SUM(CASE WHEN username = p_username THEN 1 ELSE 0 END) as username_exists
    FROM users 
    WHERE (email = p_email OR username = p_username) AND is_active = TRUE;
END //
DELIMITER ;

-- Display created objects
SELECT 'Auth database and table structure created successfully!' as message;

-- Show table structure
DESCRIBE users;

-- Show sample data
SELECT 'Sample users:' as info;
SELECT id, username, email, full_name, role, is_active, created_at 
FROM users;

-- Show database statistics
SELECT 'Database Statistics:' as info;
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admin_users,
    COUNT(CASE WHEN role = 'DESIGNER' THEN 1 END) as designer_users,
    COUNT(CASE WHEN role = 'CUSTOMER' THEN 1 END) as customer_users,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users
FROM users;