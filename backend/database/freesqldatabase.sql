-- Create the database
-- CREATE DATABASE IF NOT EXISTS bluebird_express;
-- USE bluebird_express;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager') NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('Processing', 'In Transit', 'Delivered', 'Exception') NOT NULL,
    service ENUM('Air Freight', 'Sea Freight', 'Ground Shipping') NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    estimated_delivery DATE NOT NULL,
    current_location VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    dimensions VARCHAR(50) NOT NULL,
    VALUE DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create shipment_events table
CREATE TABLE IF NOT EXISTS shipment_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shipment_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_status ON shipments(status);
CREATE INDEX idx_customer_email ON shipments(customer_email);
CREATE INDEX idx_shipment_events_shipment_id ON shipment_events(shipment_id);

-- Insert default admin / manager users
INSERT INTO users (username, password, role, created_at)
VALUES 
  ('admin', '$2b$10$YourHashedPasswordHere', 'admin', NOW()),
  ('manager', '$2b$10$YourHashedPasswordHere', 'manager', NOW())
ON DUPLICATE KEY UPDATE username = username;

-- -- Triggers to set created_at automatically

-- DELIMITER $$

-- -- For users: before insert, set created_at and updated_at
-- CREATE TRIGGER trg_users_before_insert
-- BEFORE INSERT ON users
-- FOR EACH ROW
-- BEGIN
--   SET NEW.created_at = NOW();
--   SET NEW.updated_at = NOW();
-- END$$

-- CREATE TRIGGER trg_users_before_update
-- BEFORE UPDATE ON users
-- FOR EACH ROW
-- BEGIN
--   SET NEW.updated_at = NOW();
-- END$$

-- -- For shipments: before insert, set created_at
-- CREATE TRIGGER trg_shipments_before_insert
-- BEFORE INSERT ON shipments
-- FOR EACH ROW
-- BEGIN
--   SET NEW.created_at = NOW();
-- END$$

-- -- For shipment_events: before insert, set created_at
-- CREATE TRIGGER trg_shipment_events_before_insert
-- BEFORE INSERT ON shipment_events
-- FOR EACH ROW
-- BEGIN
--   SET NEW.created_at = NOW();
-- END$$

-- DELIMITER ;
