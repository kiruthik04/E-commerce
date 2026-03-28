-- Create Database
CREATE DATABASE IF NOT EXISTS ecommerce_notifications;
USE ecommerce_notifications;

-- The tables below will be generated automatically by Hibernate (ddl-auto=update)
-- This schema script serves as a fast-reference blueprint of the physical schema

-- CREATE TABLE notifications (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   user_id BIGINT NOT NULL,
--   type VARCHAR(20) NOT NULL, -- EMAIL, SMS, IN_APP
--   channel VARCHAR(100), -- User's email or phone number
--   subject VARCHAR(255) NOT NULL,
--   message TEXT NOT NULL,
--   status VARCHAR(20) NOT NULL, -- PENDING, SENT, FAILED
--   reference_id BIGINT,
--   reference_type VARCHAR(50), -- ORDER, PAYMENT, PRODUCT
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   sent_at TIMESTAMP NULL,
--   is_read BOOLEAN NOT NULL DEFAULT FALSE,
--   INDEX idx_user_id (user_id),
--   INDEX idx_reference (reference_type, reference_id)
-- );
