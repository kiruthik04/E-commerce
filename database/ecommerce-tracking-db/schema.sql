-- Create Database
CREATE DATABASE IF NOT EXISTS ecommerce_tracking;
USE ecommerce_tracking;

-- The tables below will be generated automatically by Hibernate (ddl-auto=update)
-- This schema script serves as a fast-reference blueprint of the physical schema

-- CREATE TABLE tracking_records (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   order_id BIGINT NOT NULL UNIQUE,
--   current_status VARCHAR(50) NOT NULL,
--   current_location VARCHAR(255),
--   estimated_delivery TIMESTAMP,
--   driver_name VARCHAR(100),
--   driver_phone VARCHAR(20),
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- CREATE TABLE delivery_milestones (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   order_id BIGINT NOT NULL,
--   milestone VARCHAR(50) NOT NULL,
--   location VARCHAR(255),
--   notes VARCHAR(500),
--   timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   INDEX idx_order_id (order_id)
-- );
