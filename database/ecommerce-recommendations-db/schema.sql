-- Create Database
CREATE DATABASE IF NOT EXISTS ecommerce_recommendations;
USE ecommerce_recommendations;

-- The tables below will be generated automatically by Hibernate (ddl-auto=update)
-- This schema script serves as a fast-reference blueprint of the physical schema

-- CREATE TABLE user_behaviors (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   user_id BIGINT NOT NULL,
--   product_id BIGINT NOT NULL,
--   event_type VARCHAR(50) NOT NULL,
--   weight INT NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   INDEX idx_product_id (product_id),
--   INDEX idx_user_id (user_id)
-- );

-- CREATE TABLE product_scores (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   product_id BIGINT NOT NULL,
--   user_id BIGINT NOT NULL,
--   score INT NOT NULL DEFAULT 0,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   UNIQUE KEY uxq_product_user (product_id, user_id),
--   INDEX idx_user_score (user_id, score DESC)
-- );
