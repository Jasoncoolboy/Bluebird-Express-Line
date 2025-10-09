import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all shipments (protected route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [shipments] = await pool.execute(`
      SELECT s.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', se.id,
                 'date', DATE_FORMAT(se.date, '%Y-%m-%d'),
                 'time', TIME_FORMAT(se.time, '%H:%i'),
                 'location', se.location,
                 'status', se.status,
                 'description', se.description
               )
             ) as events
      FROM shipments s
      LEFT JOIN shipment_events se ON s.id = se.shipment_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);

    res.json({ 
      success: true, 
      data: shipments 
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get shipment by tracking number (public route)
router.get('/tracking/:number', async (req, res) => {
  try {
    const [shipments] = await pool.execute(`
      SELECT s.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', se.id,
                 'date', DATE_FORMAT(se.date, '%Y-%m-%d'),
                 'time', TIME_FORMAT(se.time, '%H:%i'),
                 'location', se.location,
                 'status', se.status,
                 'description', se.description
               )
             ) as events
      FROM shipments s
      LEFT JOIN shipment_events se ON s.id = se.shipment_id
      WHERE s.tracking_number = ?
      GROUP BY s.id
    `, [req.params.number]);

    if (!shipments[0]) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shipment not found' 
      });
    }

    res.json({ 
      success: true, 
      data: shipments[0] 
    });
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Create new shipment (protected route)
router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      tracking_number,
      status,
      service,
      origin,
      destination,
      estimated_delivery,
      current_location,
      customer_name,
      customer_email,
      customer_phone,
      weight,
      dimensions,
      value
    } = req.body;

    // Insert shipment
    const [result] = await connection.execute(`
      INSERT INTO shipments (
        tracking_number, status, service, origin, destination,
        estimated_delivery, current_location, customer_name,
        customer_email, customer_phone, weight, dimensions, value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tracking_number, status, service, origin, destination,
      estimated_delivery, current_location, customer_name,
      customer_email, customer_phone, weight, dimensions, value
    ]);

    // Add initial event
    await connection.execute(`
      INSERT INTO shipment_events (
        shipment_id, date, time, location, status, description
      ) VALUES (?, CURDATE(), CURTIME(), ?, ?, ?)
    `, [
      result.insertId,
      origin,
      'Processing',
      'Shipment created and processing initiated'
    ]);

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      data: { id: result.insertId, ...req.body } 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating shipment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  } finally {
    connection.release();
  }
});

// Update shipment (protected route)
router.put('/:id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update shipment
    const [result] = await connection.execute(
      'UPDATE shipments SET ? WHERE id = ?',
      [req.body, req.params.id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Shipment not found' 
      });
    }

    // Add update event if status changed
    if (req.body.status) {
      await connection.execute(`
        INSERT INTO shipment_events (
          shipment_id, date, time, location, status, description
        ) VALUES (?, CURDATE(), CURTIME(), ?, ?, ?)
      `, [
        req.params.id,
        req.body.current_location || 'Unknown',
        req.body.status,
        `Shipment status updated to ${req.body.status}`
      ]);
    }

    await connection.commit();
    res.json({ 
      success: true, 
      data: { id: req.params.id, ...req.body } 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating shipment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  } finally {
    connection.release();
  }
});

// Delete shipment (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM shipments WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shipment not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Shipment deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Add event to shipment (protected route)
router.post('/:id/events', authenticateToken, async (req, res) => {
  try {
    const { date, time, location, status, description } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO shipment_events (
        shipment_id, date, time, location, status, description
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [req.params.id, date, time, location, status, description]);

    res.status(201).json({ 
      success: true, 
      data: { id: result.insertId, ...req.body } 
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;