-- Create Database
CREATE DATABASE IF NOT EXISTS ecommerce_cart;
USE ecommerce_cart;

-- The tables below will be generated automatically by Hibernate (ddl-auto=update)
-- This schema script serves as a fast-reference blueprint of the physical schema

-- CREATE TABLE carts (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   user_id BIGINT NOT NULL,
--   status VARCHAR(20) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- CREATE TABLE cart_items (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   cart_id BIGINT NOT NULL,
--   product_id BIGINT NOT NULL,
--   product_name VARCHAR(255) NOT NULL,
--   product_image_url VARCHAR(1024),
--   quantity INT NOT NULL,
--   unit_price DECIMAL(10, 2) NOT NULL,
--   variant_id BIGINT,
--   variant_label VARCHAR(100),
--   FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
-- );
