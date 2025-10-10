import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';  // Make sure to export app from server.js

describe('Shipment API Tests', () => {
  let authToken;
  let createdShipmentId;

  before(async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    authToken = loginResponse.body.token;
  });

  // Test creating a new shipment
  it('should create a new shipment', async () => {
    const newShipment = {
      tracking_number: 'BBL2025TEST1',
      status: 'Processing',
      service: 'Air Freight',
      origin: 'Tokyo, Japan',
      destination: 'Sydney, Australia',
      estimated_delivery: '2025-10-30',
      current_location: 'Tokyo Airport',
      customer_name: 'Test User',
      customer_email: 'test@email.com',
      customer_phone: '+81-555-0128',
      weight: '30 kg',
      dimensions: '50x40x30 cm',
      value: 2000.00
    };

    const response = await request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newShipment);

    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
    expect(response.body.data).to.have.property('id');
    createdShipmentId = response.body.data.id;
  });

  // Test getting all shipments
  it('should get all shipments', async () => {
    const response = await request(app)
      .get('/api/shipments')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.data).to.be.an('array');
  });

  // Test updating a shipment
  it('should update a shipment', async () => {
    const updateData = {
      status: 'In Transit',
      current_location: 'Tokyo International Airport'
    };

    const response = await request(app)
      .put(`/api/shipments/${createdShipmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test getting a shipment by tracking number
  it('should get shipment by tracking number', async () => {
    const response = await request(app)
      .get('/api/shipments/tracking/BBL2025TEST1');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.data).to.have.property('tracking_number');
  });
});