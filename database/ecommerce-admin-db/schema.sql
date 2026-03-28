CREATE DATABASE IF NOT EXISTS ecommerce_admin;
USE ecommerce_admin;

INSERT INTO seller_profiles (user_id, store_name, gst_number, bank_account, is_approved, created_at) VALUES
(4,  'TechZone Electronics',        '07AAAAA0000A1Z5', 'HDFC0001234-4001234567', 1, NOW() - INTERVAL 60 DAY),
(5,  'Fashion Forward India',        '29BBBBB1111B2Z3', 'ICIC0009876-9876543210', 0, NOW() - INTERVAL 5  DAY),
(6,  'HomeDecor Bazaar',             '19CCCCC2222C3Z1', 'SBI00012345-1234509876', 0, NOW() - INTERVAL 2  DAY),
(7,  'Gourmet Kitchen Essentials',   '06DDDDD3333D4Z9', 'AXIS0004567-4567891230', 1, NOW() - INTERVAL 30 DAY),
(8,  'Sports & Outdoors Hub',        '33EEEEE4444E5Z7', 'KKBK0007890-7890123456', 0, NOW() - INTERVAL 1  DAY);
