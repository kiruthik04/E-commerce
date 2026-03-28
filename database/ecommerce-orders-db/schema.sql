-- Create Database
CREATE DATABASE IF NOT EXISTS ecommerce_orders;
USE ecommerce_orders;

-- The tables below will be generated automatically by Hibernate (ddl-auto=update)
-- This schema script serves as a fast-reference blueprint of the physical schema

-- CREATE TABLE orders (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   user_id BIGINT NOT NULL,
--   status VARCHAR(20) NOT NULL,
--   total_amount DECIMAL(10, 2) NOT NULL,
--   shipping_address JSON,
--   payment_id VARCHAR(100),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- CREATE TABLE order_items (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   order_id BIGINT NOT NULL,
--   product_id BIGINT NOT NULL,
--   product_name VARCHAR(255) NOT NULL,
--   quantity INT NOT NULL,
--   unit_price DECIMAL(10, 2) NOT NULL,
--   total_price DECIMAL(10, 2) NOT NULL,
--   FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
-- );

-- CREATE TABLE order_status_history (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   order_id BIGINT NOT NULL,
--   previous_status VARCHAR(20),
--   new_status VARCHAR(20) NOT NULL,
--   changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   changed_by VARCHAR(50) NOT NULL,
--   FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
-- );
