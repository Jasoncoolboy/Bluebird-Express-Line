-- Seed 50 shipments with events
-- Run this against the bluebird_DB database

SET @i = 1;

-- We'll insert 50 shipments
INSERT INTO shipments (
  tracking_number, status, service, origin, destination,
  estimated_delivery, current_location, customer_name, customer_email,
  customer_phone, weight, dimensions, value, created_at, updated_at
)
SELECT
  CONCAT('BBL2025', LPAD(t.seq, 4, '0')) as tracking_number,
  ELT(FLOOR(1 + RAND() * 4), 'Processing', 'In Transit', 'Delivered', 'Exception') as status,
  ELT(FLOOR(1 + RAND() * 3), 'Air Freight', 'Sea Freight', 'Ground Shipping') as service,
  ELT(FLOOR(1 + RAND() * 6), 'New York, USA','Shanghai, China','Dubai, UAE','Rotterdam, Netherlands','Toronto, Canada','London, UK') as origin,
  ELT(FLOOR(1 + RAND() * 6), 'London, UK','Los Angeles, USA','Singapore','New York, USA','Montreal, Canada','Paris, France') as destination,
  DATE_ADD(CURDATE(), INTERVAL FLOOR(RAND()*30) DAY) as estimated_delivery,
  ELT(FLOOR(1 + RAND() * 6), 'In Transit', 'At Hub', 'Departed', 'Arrived', 'At Customs', 'Out for Delivery') as current_location,
  CONCAT('Customer ', t.seq) as customer_name,
  CONCAT('customer', t.seq, '@example.com') as customer_email,
  CONCAT('+60', LPAD(FLOOR(100000 + RAND()*899999), 9, '0')) as customer_phone,
  CONCAT(FLOOR(1 + RAND()*500), ' kg') as weight,
  CONCAT(FLOOR(10 + RAND()*200), 'x', FLOOR(10 + RAND()*200), 'x', FLOOR(10 + RAND()*200), ' cm') as dimensions,
  ROUND(RAND()*20000 + 50, 2) as value,
  NOW(), NOW()
FROM (
  SELECT @i:=@i+1 AS seq FROM information_schema.columns LIMIT 50
) t;

-- Add 1-3 events per inserted shipment (join via tracking number)
INSERT INTO shipment_events (shipment_id, date, time, location, status, description)
SELECT s.id,
  DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND()*10) DAY) as date,
  MAKETIME(FLOOR(RAND()*23), FLOOR(RAND()*59), 0) as time,
  ELT(FLOOR(1 + RAND() * 6), 'Origin Hub','Transit Hub','Destination Hub','Customs','Airport','Port') as location,
  ELT(FLOOR(1 + RAND() * 4), 'Picked Up','In Transit','Delivered','Processing') as status,
  CONCAT('Auto-generated event ', FLOOR(RAND()*1000)) as description
FROM shipments s
WHERE s.tracking_number LIKE 'BBL2025%'
LIMIT 120; -- up to ~2-3 events per shipment

SELECT COUNT(*) as total_shipments FROM shipments WHERE tracking_number LIKE 'BBL2025%';
SELECT COUNT(*) as total_events FROM shipment_events WHERE shipment_id IN (SELECT id FROM shipments WHERE tracking_number LIKE 'BBL2025%');
