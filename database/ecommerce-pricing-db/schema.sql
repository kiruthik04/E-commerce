CREATE DATABASE IF NOT EXISTS ecommerce_pricing;
USE ecommerce_pricing;

-- Tables auto-created by Hibernate; seed data below.

INSERT INTO coupons (code, type, value, min_order_amount, max_discount_amount, usage_limit, used_count, valid_from, valid_until, is_active) VALUES
('WELCOME20',   'PERCENT',       20.00, 500.00,  500.00,  1000, 0,   '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
('FLAT200',     'FLAT',         200.00, 1000.00, NULL,    500,  0,   '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
('BIGBUY15',    'PERCENT',       15.00, 5000.00, 1500.00, 200,  0,   '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
('FREESHIP',    'FREE_SHIPPING',  0.00, 299.00,  NULL,    0,    0,   '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1),
('FLASH50',     'PERCENT',       50.00, 2000.00, 1000.00, 100,  0,   '2026-03-01 00:00:00', '2026-06-30 23:59:59', 1),
('SAVE500',     'FLAT',         500.00, 3000.00, NULL,    50,   0,   '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1);

INSERT INTO discount_rules (name, type, target_id, discount_percent, start_date, end_date, is_active) VALUES
('iPhone 15 Launch Offer',        'PRODUCT',  '1',           10.00, '2026-01-01', '2026-12-31', 1),
('Samsung Galaxy Deal',           'PRODUCT',  '2',           8.00,  '2026-01-01', '2026-12-31', 1),
('Smartphones Category Sale',     'CATEGORY', 'Smartphones', 5.00,  '2026-03-01', '2026-06-30', 1),
('Audio Mega Sale',               'CATEGORY', 'Audio',       15.00, '2026-03-01', '2026-06-30', 1),
('Laptops Year-End Clearance',    'CATEGORY', 'Laptops',     12.00, '2026-03-01', '2026-09-30', 1),
('Sitewide Cart Discount 3%',     'CART',     NULL,           3.00, '2026-01-01', '2026-12-31', 1);
