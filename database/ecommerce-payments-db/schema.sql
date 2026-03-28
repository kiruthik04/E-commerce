-- Create Database
CREATE DATABASE IF NOT EXISTS ecommerce_payments;
USE ecommerce_payments;

-- The tables below will be generated automatically by Hibernate (ddl-auto=update)
-- This schema script serves as a fast-reference blueprint of the physical schema

-- CREATE TABLE payments (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   order_id BIGINT NOT NULL,
--   user_id BIGINT NOT NULL,
--   amount DECIMAL(10, 2) NOT NULL,
--   currency VARCHAR(3) NOT NULL DEFAULT 'INR',
--   method VARCHAR(20) NOT NULL,
--   status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
--   transaction_id VARCHAR(100) UNIQUE,
--   gateway_response JSON,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE refunds (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   payment_id BIGINT NOT NULL,
--   amount DECIMAL(10, 2) NOT NULL,
--   reason VARCHAR(255),
--   status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
-- );
