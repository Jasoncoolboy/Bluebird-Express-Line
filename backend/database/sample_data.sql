-- Insert admin user
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$YourHashedPasswordHere', 'admin');

-- Insert sample shipments
INSERT INTO shipments (
    tracking_number, status, service, origin, destination,
    estimated_delivery, current_location, customer_name,
    customer_email, customer_phone, weight, dimensions, value
) VALUES
    ('BBL2025001', 'In Transit', 'Air Freight', 'New York, USA', 'London, UK',
    '2025-10-15', 'Paris, France', 'John Smith',
    'john.smith@email.com', '+1-555-0123', '25.5 kg', '45x35x25 cm', 2500.00),
    
    ('BBL2025002', 'Processing', 'Sea Freight', 'Shanghai, China', 'Los Angeles, USA',
    '2025-11-01', 'Shanghai Port', 'Alice Chen',
    'alice.chen@email.com', '+86-555-0124', '1500 kg', '200x150x180 cm', 12000.00),
    
    ('BBL2025003', 'Delivered', 'Ground Shipping', 'Toronto, Canada', 'Montreal, Canada',
    '2025-10-08', 'Montreal, Canada', 'Marie Dubois',
    'marie.d@email.com', '+1-555-0125', '10 kg', '30x20x15 cm', 500.00),
    
    ('BBL2025004', 'In Transit', 'Air Freight', 'Dubai, UAE', 'Singapore',
    '2025-10-20', 'Mumbai, India', 'Raj Patel',
    'raj.patel@email.com', '+971-555-0126', '45 kg', '60x40x35 cm', 3500.00),
    
    ('BBL2025005', 'Exception', 'Sea Freight', 'Rotterdam, Netherlands', 'New York, USA',
    '2025-10-25', 'Atlantic Ocean', 'Michael Brown',
    'michael.b@email.com', '+31-555-0127', '2000 kg', '250x180x200 cm', 15000.00);

-- Insert sample shipment events
INSERT INTO shipment_events (
    shipment_id, date, time, location, status, description
) VALUES
    (1, '2025-10-08', '09:00:00', 'New York Airport', 'Picked Up', 'Package picked up from sender'),
    (1, '2025-10-09', '15:30:00', 'Paris Airport', 'In Transit', 'Package arrived at transit point'),
    
    (2, '2025-10-08', '14:00:00', 'Shanghai Port', 'Processing', 'Package received at port'),
    
    (3, '2025-10-07', '10:00:00', 'Toronto Hub', 'Picked Up', 'Package picked up from sender'),
    (3, '2025-10-08', '09:30:00', 'Montreal Hub', 'Delivered', 'Package delivered to recipient'),
    
    (4, '2025-10-08', '08:00:00', 'Dubai Airport', 'Picked Up', 'Package picked up from sender'),
    (4, '2025-10-09', '16:45:00', 'Mumbai Airport', 'In Transit', 'Package in transit to destination'),
    
    (5, '2025-10-08', '11:00:00', 'Rotterdam Port', 'Processing', 'Package loaded onto vessel'),
    (5, '2025-10-09', '14:20:00', 'Atlantic Ocean', 'Exception', 'Delay due to weather conditions');