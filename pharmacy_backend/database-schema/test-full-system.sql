-- ============================================
-- PHARMACY SYSTEM - COMPLETE TEST DATA (FIXED)
-- ============================================

-- 1. CLEAN EXISTING DATA (Optional - Comment out if you want to keep existing)
-- DELETE FROM sale_items;
-- DELETE FROM sales;
-- DELETE FROM inventory_transactions;
-- DELETE FROM batches;
-- DELETE FROM medicines;
-- DELETE FROM suppliers;
-- DELETE FROM customers;
-- DELETE FROM users;

-- ============================================
-- 2. CREATE USERS
-- ============================================
INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye3.Z9j3gJ1k6Z7yB7fKq7n6nL4L5T6Oq', 'System Admin', 'admin', true),
('pharmacist1', '$2a$10$N9qo8uLOickgx2ZMRZoMye3.Z9j3gJ1k6Z7yB7fKq7n6nL4L5T6Oq', 'John Pharmacist', 'pharmacist', true),
('cashier1', '$2a$10$N9qo8uLOickgx2ZMRZoMye3.Z9j3gJ1k6Z7yB7fKq7n6nL4L5T6Oq', 'Mary Cashier', 'cashier', true)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 3. CREATE SUPPLIERS
-- ============================================
INSERT INTO suppliers (name, contact_person, email, phone, address, is_active) VALUES
('MediPharm Distributors', 'John Doe', 'john@medipharm.com', '+251911111111', 'Addis Ababa, Bole Road', true),
('Global Healthcare Ltd', 'Jane Smith', 'jane@globalhealth.com', '+251922222222', 'Addis Ababa, Mexico Square', true),
('PharmaEthiopia', 'Abebe Kebede', 'abebe@pharmaeth.com', '+251933333333', 'Addis Ababa, Kazanchis', true),
('Addis Pharma', 'Tigist Haile', 'tigist@addispharma.com', '+251944444444', 'Addis Ababa, Merkato', true),
('East Africa Medical', 'Samuel Tesfaye', 'samuel@eastafrica.com', '+251955555555', 'Adama, Main Road', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 4. CREATE MEDICINES WITH DIFFERENT CATEGORIES
-- ============================================
INSERT INTO medicines (name, generic_name, brand, category, form, strength, unit, barcode, reorder_level, is_active) VALUES
-- Analgesics (Pain Killers)
('Paracetamol 500mg', 'Acetaminophen', 'Tylenol', 'Analgesic', 'Tablet', '500mg', 'mg', '1234567890123', 50, true),
('Ibuprofen 400mg', 'Ibuprofen', 'Advil', 'Analgesic', 'Tablet', '400mg', 'mg', '1234567890124', 30, true),
('Tramadol 50mg', 'Tramadol', 'Tramal', 'Analgesic', 'Capsule', '50mg', 'mg', '1234567890125', 20, true),

-- Antibiotics
('Amoxicillin 500mg', 'Amoxicillin', 'Amoxil', 'Antibiotic', 'Capsule', '500mg', 'mg', '1234567890126', 40, true),
('Azithromycin 250mg', 'Azithromycin', 'Zithromax', 'Antibiotic', 'Tablet', '250mg', 'mg', '1234567890127', 25, true),
('Ciprofloxacin 500mg', 'Ciprofloxacin', 'Cipro', 'Antibiotic', 'Tablet', '500mg', 'mg', '1234567890128', 30, true),
('Doxycycline 100mg', 'Doxycycline', 'Vibramycin', 'Antibiotic', 'Capsule', '100mg', 'mg', '1234567890129', 20, true),

-- Anti-diabetic
('Metformin 500mg', 'Metformin HCl', 'Glucophage', 'Anti-diabetic', 'Tablet', '500mg', 'mg', '1234567890130', 60, true),
('Glibenclamide 5mg', 'Glibenclamide', 'Daonil', 'Anti-diabetic', 'Tablet', '5mg', 'mg', '1234567890131', 40, true),
('Insulin Regular', 'Human Insulin', 'Humulin R', 'Anti-diabetic', 'Injection', '100IU', 'ml', '1234567890132', 15, true),

-- Cardiovascular
('Amlodipine 5mg', 'Amlodipine', 'Norvasc', 'Cardiovascular', 'Tablet', '5mg', 'mg', '1234567890133', 45, true),
('Lisinopril 10mg', 'Lisinopril', 'Zestril', 'Cardiovascular', 'Tablet', '10mg', 'mg', '1234567890134', 40, true),
('Atorvastatin 20mg', 'Atorvastatin', 'Lipitor', 'Cardiovascular', 'Tablet', '20mg', 'mg', '1234567890135', 35, true),

-- Respiratory
('Salbutamol Inhaler', 'Albuterol', 'Ventolin', 'Respiratory', 'Inhaler', '100mcg', 'dose', '1234567890136', 10, true),
('Ambroxol Syrup', 'Ambroxol', 'Mucolite', 'Respiratory', 'Syrup', '30mg/5ml', 'ml', '1234567890137', 25, true),
('Cetirizine 10mg', 'Cetirizine', 'Zyrtec', 'Respiratory', 'Tablet', '10mg', 'mg', '1234567890138', 30, true),

-- Gastrointestinal
('Omeprazole 20mg', 'Omeprazole', 'Losec', 'Gastrointestinal', 'Capsule', '20mg', 'mg', '1234567890139', 35, true),
('Ranitidine 150mg', 'Ranitidine', 'Zantac', 'Gastrointestinal', 'Tablet', '150mg', 'mg', '1234567890140', 30, true),

-- Vitamins
('Vitamin C 500mg', 'Ascorbic Acid', 'Cevit', 'Vitamins', 'Tablet', '500mg', 'mg', '1234567890141', 50, true),
('Vitamin D3 1000IU', 'Cholecalciferol', 'D-Forte', 'Vitamins', 'Capsule', '1000IU', 'IU', '1234567890142', 40, true),
('Multivitamin', 'Multivitamin', 'Mega-V', 'Vitamins', 'Tablet', '1tab', 'tab', '1234567890143', 60, true)
ON CONFLICT (barcode) DO NOTHING;

-- ============================================
-- 5. CREATE BATCHES WITH VARIOUS EXPIRY DATES
-- ============================================
-- CRITICAL: Expiring within 30 days
INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-CRT-001', medicine_id, '2026-03-01', '2025-08-01', 1, 45, 2.50, 5.00, true 
FROM medicines WHERE name = 'Paracetamol 500mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-CRT-002', medicine_id, '2026-03-05', '2025-09-01', 1, 30, 15.00, 30.00, true 
FROM medicines WHERE name = 'Amoxicillin 500mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-CRT-003', medicine_id, '2026-03-10', '2025-10-01', 2, 20, 3.00, 6.00, true 
FROM medicines WHERE name = 'Metformin 500mg' LIMIT 1;

-- WARNING: Expiring within 90 days
INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-WRN-001', medicine_id, '2026-04-15', '2025-11-01', 1, 100, 2.50, 5.00, true 
FROM medicines WHERE name = 'Ibuprofen 400mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-WRN-002', medicine_id, '2026-05-01', '2025-12-01', 2, 80, 8.00, 16.00, true 
FROM medicines WHERE name = 'Omeprazole 20mg' LIMIT 1;

-- GOOD: Expiring in 1+ year
INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-OK-001', medicine_id, '2027-12-31', '2026-01-15', 1, 200, 2.20, 4.50, true 
FROM medicines WHERE name = 'Paracetamol 500mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-OK-002', medicine_id, '2028-06-30', '2026-02-01', 2, 150, 12.00, 25.00, true 
FROM medicines WHERE name = 'Azithromycin 250mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-OK-003', medicine_id, '2027-10-31', '2026-01-20', 3, 300, 1.80, 3.50, true 
FROM medicines WHERE name = 'Vitamin C 500mg' LIMIT 1;

-- LOW STOCK SCENARIOS
INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-LOW-CRT-001', medicine_id, '2027-08-31', '2026-02-10', 2, 5, 25.00, 50.00, true 
FROM medicines WHERE name = 'Tramadol 50mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-LOW-WRN-001', medicine_id, '2027-09-30', '2026-02-15', 3, 25, 35.00, 70.00, true 
FROM medicines WHERE name = 'Insulin Regular' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'BATCH-OOS-001', medicine_id, '2027-07-31', '2026-01-30', 1, 0, 45.00, 90.00, true 
FROM medicines WHERE name = 'Atorvastatin 20mg' LIMIT 1;

-- MULTIPLE BATCHES FOR SAME MEDICINE
INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'AML-2025-001', medicine_id, '2026-04-30', '2025-10-01', 2, 50, 3.00, 6.00, true 
FROM medicines WHERE name = 'Amlodipine 5mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'AML-2026-001', medicine_id, '2027-05-31', '2026-02-01', 2, 80, 3.20, 6.50, true 
FROM medicines WHERE name = 'Amlodipine 5mg' LIMIT 1;

INSERT INTO batches (batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active) 
SELECT 'AML-2026-002', medicine_id, '2028-01-31', '2026-02-15', 4, 120, 3.50, 7.00, true 
FROM medicines WHERE name = 'Amlodipine 5mg' LIMIT 1;

-- ============================================
-- 6. CREATE CUSTOMERS (YOUR SCHEMA - NO EMAIL COLUMN)
-- ============================================
INSERT INTO customers (name, phone, address, created_at) VALUES
('Abebe Kebede', '+251911223344', 'Addis Ababa', NOW() - INTERVAL '30 days'),
('Tigist Haile', '+251922334455', 'Addis Ababa', NOW() - INTERVAL '45 days'),
('Bekele Alemu', '+251933445566', 'Adama', NOW() - INTERVAL '60 days'),
('Almaz Tesfaye', '+251944556677', 'Bahir Dar', NOW() - INTERVAL '20 days'),
('Henok Desta', '+251955667788', 'Gondar', NOW() - INTERVAL '15 days')
ON CONFLICT (phone) DO NOTHING;

-- Update total_visits and last_visit (these columns exist in your schema)
UPDATE customers SET total_visits = 5, last_visit = NOW() - INTERVAL '2 days' WHERE phone = '+251911223344';
UPDATE customers SET total_visits = 3, last_visit = NOW() - INTERVAL '5 days' WHERE phone = '+251922334455';
UPDATE customers SET total_visits = 8, last_visit = NOW() - INTERVAL '1 day' WHERE phone = '+251933445566';
UPDATE customers SET total_visits = 2, last_visit = NOW() - INTERVAL '10 days' WHERE phone = '+251944556677';
UPDATE customers SET total_visits = 1, last_visit = NOW() - INTERVAL '15 days' WHERE phone = '+251955667788';

-- ============================================
-- 7. VERIFY THE DATA
-- ============================================
SELECT '✅ TEST DATA LOADED SUCCESSFULLY' as status;
SELECT '📊 MEDICINES COUNT: ' || COUNT(*) FROM medicines;
SELECT '📦 BATCHES COUNT: ' || COUNT(*) FROM batches;
SELECT '⚠️ EXPIRING SOON (30 days): ' || COUNT(*) FROM batches WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days';
SELECT '⚠️ EXPIRING WARNING (90 days): ' || COUNT(*) FROM batches WHERE expiry_date BETWEEN CURRENT_DATE + INTERVAL '31 days' AND CURRENT_DATE + INTERVAL '90 days';
SELECT '🔴 LOW STOCK (Critical): ' || COUNT(*) FROM medicines m WHERE (SELECT COALESCE(SUM(quantity),0) FROM batches b WHERE b.medicine_id = m.medicine_id AND b.is_active = true) <= m.reorder_level;
SELECT '🟡 LOW STOCK (Warning): ' || COUNT(*) FROM medicines m WHERE 
    (SELECT COALESCE(SUM(quantity),0) FROM batches b WHERE b.medicine_id = m.medicine_id AND b.is_active = true) > m.reorder_level 
    AND (SELECT COALESCE(SUM(quantity),0) FROM batches b WHERE b.medicine_id = m.medicine_id AND b.is_active = true) <= m.reorder_level * 1.5;
SELECT '📉 OUT OF STOCK: ' || COUNT(*) FROM medicines m WHERE (SELECT COALESCE(SUM(quantity),0) FROM batches b WHERE b.medicine_id = m.medicine_id AND b.is_active = true) = 0;
