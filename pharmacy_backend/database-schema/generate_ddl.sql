-- ============================================
-- PHARMACY INVENTORY SYSTEM - COMPLETE DDL
-- Generated: 2026-02-12
-- ============================================

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS expiry_alerts CASCADE;
DROP TABLE IF EXISTS wastage CASCADE;
DROP TABLE IF EXISTS returns CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLE: users
-- Purpose: Pharmacy staff authentication & roles
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'pharmacist',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- TABLE: medicines
-- Purpose: Medicine master catalog
-- ============================================
CREATE TABLE medicines (
    medicine_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand VARCHAR(100),
    category VARCHAR(100),
    form VARCHAR(50),
    strength VARCHAR(100),
    unit VARCHAR(50),
    barcode VARCHAR(50) UNIQUE,
    reorder_level INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medicines_name ON medicines(name);
CREATE INDEX idx_medicines_category ON medicines(category);
CREATE INDEX idx_medicines_barcode ON medicines(barcode);

-- ============================================
-- TABLE: suppliers
-- Purpose: Medicine vendors/suppliers
-- ============================================
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_email ON suppliers(email);

-- ============================================
-- TABLE: customers
-- Purpose: Pharmacy customers/patients
-- Business Rule: Phone number as primary identifier
-- ============================================
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    total_visits INTEGER DEFAULT 0,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_name ON customers(name);

-- ============================================
-- TABLE: batches
-- Purpose: Physical stock batches with expiry
-- Core Business Logic: FIFO/FEFO compliance
-- ============================================
CREATE TABLE batches (
    batch_id SERIAL PRIMARY KEY,
    batch_number VARCHAR(100) NOT NULL,
    medicine_id INTEGER NOT NULL REFERENCES medicines(medicine_id) ON DELETE CASCADE,
    expiry_date DATE NOT NULL,
    manufacturing_date DATE,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_selling_price CHECK (selling_price >= cost_price),
    CONSTRAINT chk_expiry_date CHECK (expiry_date > manufacturing_date)
);

CREATE INDEX idx_batches_batch_number ON batches(batch_number);
CREATE INDEX idx_batches_medicine_id ON batches(medicine_id);
CREATE INDEX idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX idx_batches_medicine_expiry ON batches(medicine_id, expiry_date);

-- ============================================
-- TABLE: sales
-- Purpose: Sales transactions & invoices
-- ============================================
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    prescription_id VARCHAR(100) NOT NULL,
    doctor_name VARCHAR(100),
    items_total DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'paid',
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sold_by INTEGER NOT NULL REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_invoice ON sales(invoice_number);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(sale_date);

-- ============================================
-- TABLE: sale_items
-- Purpose: Individual line items in sales
-- ============================================
CREATE TABLE sale_items (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    batch_id INTEGER NOT NULL REFERENCES batches(batch_id),
    medicine_id INTEGER NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_batch ON sale_items(batch_id);

-- ============================================
-- TABLE: wastage
-- Purpose: Track damaged, expired, lost medicines
-- Business Value: Loss analysis & prevention
-- ============================================
CREATE TABLE wastage (
    wastage_id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES batches(batch_id),
    medicine_id INTEGER NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    total_loss DECIMAL(10,2) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    notes TEXT,
    reported_by INTEGER NOT NULL REFERENCES users(user_id),
    reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wastage_batch ON wastage(batch_id);
CREATE INDEX idx_wastage_date ON wastage(reported_date);

-- ============================================
-- TABLE: returns
-- Purpose: Customer returns & supplier returns
-- ============================================
CREATE TABLE returns (
    return_id SERIAL PRIMARY KEY,
    return_type VARCHAR(20) NOT NULL,
    reference_id VARCHAR(50) NOT NULL,
    batch_id INTEGER NOT NULL REFERENCES batches(batch_id),
    medicine_id INTEGER NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    notes TEXT,
    created_by INTEGER NOT NULL REFERENCES users(user_id),
    approved_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_returns_batch ON returns(batch_id);
CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_returns_date ON returns(created_at);

-- ============================================
-- TABLE: inventory_transactions
-- Purpose: Complete audit trail for all stock movements
-- ============================================
CREATE TABLE inventory_transactions (
    transaction_id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES batches(batch_id),
    transaction_type VARCHAR(20) NOT NULL,
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reference_id VARCHAR(100),
    notes TEXT,
    performed_by INTEGER REFERENCES users(user_id),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inv_trans_batch ON inventory_transactions(batch_id);
CREATE INDEX idx_inv_trans_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_inv_trans_type ON inventory_transactions(transaction_type);

-- ============================================
-- TABLE: expiry_alerts
-- Purpose: Automatic expiry notifications
-- ============================================
CREATE TABLE expiry_alerts (
    alert_id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES batches(batch_id),
    alert_date DATE DEFAULT CURRENT_DATE,
    days_until_expiry INTEGER NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expiry_alerts_batch ON expiry_alerts(batch_id);
CREATE INDEX idx_expiry_alerts_resolved ON expiry_alerts(is_resolved);

-- ============================================
-- VIEWS: Reporting & Analytics
-- ============================================

-- Current inventory view
CREATE OR REPLACE VIEW current_inventory AS
SELECT 
    m.medicine_id,
    m.name,
    m.generic_name,
    m.brand,
    m.category,
    m.reorder_level,
    COALESCE(SUM(b.quantity), 0) AS total_quantity,
    COUNT(b.batch_id) AS batch_count
FROM medicines m
LEFT JOIN batches b ON m.medicine_id = b.medicine_id AND b.is_active = true
GROUP BY m.medicine_id, m.name, m.generic_name, m.brand, m.category, m.reorder_level;

-- Low stock medicines view
CREATE OR REPLACE VIEW low_stock_medicines AS
SELECT 
    m.medicine_id,
    m.name,
    m.generic_name,
    ci.total_quantity,
    m.reorder_level,
    CASE 
        WHEN ci.total_quantity <= m.reorder_level THEN 'CRITICAL'
        WHEN ci.total_quantity <= m.reorder_level * 1.5 THEN 'LOW'
        ELSE 'OK'
    END AS stock_status
FROM medicines m
JOIN current_inventory ci ON m.medicine_id = ci.medicine_id
WHERE ci.total_quantity <= m.reorder_level * 1.5;

-- Near expiry medicines view
CREATE OR REPLACE VIEW near_expiry_medicines AS
SELECT 
    m.name,
    m.generic_name,
    b.batch_number,
    b.expiry_date,
    b.quantity,
    b.selling_price,
    (b.expiry_date - CURRENT_DATE) AS days_until_expiry
FROM medicines m
JOIN batches b ON m.medicine_id = b.medicine_id
WHERE b.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 90
AND b.is_active = true
ORDER BY b.expiry_date ASC;

-- ============================================
-- FUNCTIONS & PROCEDURES
-- ============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE
ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batches_updated_at BEFORE UPDATE
ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS: Database Documentation
-- ============================================

COMMENT ON TABLE medicines IS 'Master catalog of all medicines';
COMMENT ON TABLE batches IS 'Physical stock batches with expiry tracking - critical for FIFO/FEFO';
COMMENT ON TABLE customers IS 'Pharmacy customers - phone number as primary identifier';
COMMENT ON TABLE sales IS 'Sales transactions with prescription tracking';
COMMENT ON TABLE wastage IS 'Track damaged, expired, and lost inventory for loss analysis';
COMMENT ON TABLE returns IS 'Customer returns and supplier returns processing';
COMMENT ON COLUMN batches.expiry_date IS 'Must be in the future - validated by application';
COMMENT ON COLUMN batches.quantity IS 'Never negative - constrained by CHECK';
COMMENT ON COLUMN sales.prescription_id IS 'Required field - Ethiopian pharmacy regulation';