-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_catalog;
USE ecommerce_catalog;

-- Clear previous data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_variants;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Categories
INSERT INTO categories (id, name, slug, parent_id) VALUES 
(1, 'Electronics', 'electronics', NULL),
(2, 'Laptops', 'laptops', 1),
(3, 'Smartphones', 'smartphones', 1),
(4, 'Audio', 'audio', 1),
(5, 'Clothing', 'clothing', NULL),
(6, 'Men', 'men', 5),
(7, 'Women', 'women', 5);

-- Seed Products
INSERT INTO products (id, name, slug, description, price, discount_price, stock_qty, status, category_id, seller_id, created_at, updated_at) VALUES 
(1, 'MacBook Pro M3', 'macbook-pro-m3', 'Apple MacBook Pro with M3 Chip', 1999.00, 1899.00, 50, 'ACTIVE', 2, 1, NOW(), NOW()),
(2, 'Dell XPS 15', 'dell-xps-15', 'Dell XPS 15 OLED', 1799.00, NULL, 30, 'ACTIVE', 2, 1, NOW(), NOW()),
(3, 'iPhone 15 Pro', 'iphone-15-pro', 'Apple iPhone 15 Pro 256GB', 999.00, NULL, 100, 'ACTIVE', 3, 2, NOW(), NOW()),
(4, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Samsung Galaxy S24 Ultra 512GB', 1299.00, 1199.00, 75, 'ACTIVE', 3, 2, NOW(), NOW()),
(5, 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Sony Noise Cancelling Headphones', 398.00, 348.00, 150, 'ACTIVE', 4, 3, NOW(), NOW()),
(6, 'AirPods Pro 2', 'airpods-pro-2', 'Apple AirPods Pro 2nd Gen', 249.00, 199.00, 200, 'ACTIVE', 4, 1, NOW(), NOW()),
(7, 'Levi''s 501 Original Fit Jeans', 'levis-501-original', 'Classic Levi''s 501 men''s jeans', 79.50, 59.50, 300, 'ACTIVE', 6, 4, NOW(), NOW()),
(8, 'Nike Air Force 1', 'nike-air-force-1', 'Classic Nike Air Force 1 Sneakers', 110.00, NULL, 120, 'ACTIVE', 6, 5, NOW(), NOW()),
(9, 'Adidas Ultraboost', 'adidas-ultraboost', 'Adidas Ultraboost Running Shoes', 190.00, 150.00, 90, 'ACTIVE', 7, 5, NOW(), NOW()),
(10, 'Zara Basic T-Shirt', 'zara-basic-tshirt', 'Cotton basic t-shirt', 15.00, 12.00, 500, 'ACTIVE', 7, 6, NOW(), NOW());

-- Seed Product Images
INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order) VALUES 
(1, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000', 1, 0),
(2, 2, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000', 1, 0),
(3, 3, 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=1000', 1, 0),
(4, 4, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1000', 1, 0),
(5, 5, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000', 1, 0),
(6, 6, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=1000', 1, 0),
(7, 7, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1000', 1, 0),
(8, 8, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000', 1, 0),
(9, 9, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1000', 1, 0),
(10, 10, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000', 1, 0);

-- Seed Product Variants
INSERT INTO product_variants (id, product_id, variant_name, variant_value, price_modifier, stock) VALUES 
(1, 1, 'Color', 'Space Black', 0.00, 30),
(2, 1, 'Color', 'Silver', 0.00, 20),
(3, 1, 'RAM', '16GB', 0.00, 40),
(4, 1, 'RAM', '32GB', 200.00, 10),
(5, 7, 'Size', '30x30', 0.00, 100),
(6, 7, 'Size', '32x32', 0.00, 150),
(7, 7, 'Size', '34x32', 0.00, 50),
(8, 8, 'Size', 'US 9', 0.00, 40),
(9, 8, 'Size', 'US 10', 0.00, 60),
(10, 8, 'Size', 'US 11', 0.00, 20);
