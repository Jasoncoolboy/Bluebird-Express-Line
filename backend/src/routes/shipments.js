import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from './auth.js';
import { authorizeRoles } from './authz.js';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Get all shipments (protected route)
router.get('/', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    // First, get all shipments
    const [shipments] = await pool.execute(`
      SELECT * FROM shipments ORDER BY created_at DESC
    `);

    // Then, for each shipment, get its events
    const shipmentsWithEvents = await Promise.all(
      shipments.map(async (shipment) => {
        const [events] = await pool.execute(`
          SELECT 
            id,
            DATE_FORMAT(date, '%Y-%m-%d') as date,
            TIME_FORMAT(time, '%H:%i') as time,
            location,
            status,
            description
          FROM shipment_events 
          WHERE shipment_id = ?
          ORDER BY date ASC, time ASC
        `, [shipment.id]);

        return {
          ...shipment,
          events: events || []
        };
      })
    );

    res.json({ 
      success: true, 
      data: shipmentsWithEvents
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
router.get('/tracking/:number',
  param('number').isLength({ min: 6, max: 40 }).trim().escape(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Invalid tracking number', errors: errors.array() });
  }
  try {
    // First, get the shipment details
    const [shipments] = await pool.execute(`
      SELECT * FROM shipments WHERE tracking_number = ?
    `, [req.params.number]);

    if (shipments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Then get the events for this shipment
    const [events] = await pool.execute(`
      SELECT 
        id,
        DATE_FORMAT(date, '%Y-%m-%d') as date,
        TIME_FORMAT(time, '%H:%i') as time,
        location,
        status,
        description
      FROM shipment_events 
      WHERE shipment_id = ?
      ORDER BY date ASC, time ASC
    `, [shipments[0].id]);

    const shipmentWithEvents = {
      ...shipments[0],
      events: events || []
    };

    res.json({
      success: true,
      data: shipmentWithEvents
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
router.post('/',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  body('trackingNumber').optional().isString().isLength({ min: 6, max: 40 }).trim().escape(),
  body('status').optional().isString().isLength({ min: 2, max: 50 }).trim().escape(),
  body('service').optional().isString().isLength({ min: 2, max: 50 }).trim().escape(),
  body('origin').optional().isString().isLength({ min: 2, max: 100 }).trim().escape(),
  body('destination').optional().isString().isLength({ min: 2, max: 100 }).trim().escape(),
  body('estimatedDelivery').optional().isString().isLength({ min: 2, max: 50 }).trim(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

      // Accept both snake_case (from some clients) and camelCase (from frontend)
      const tracking_number = req.body.trackingNumber ?? req.body.tracking_number ?? null;
      const status = req.body.status ?? req.body.shipmentStatus ?? null;
      const service = req.body.service ?? null;
      const origin = req.body.origin ?? null;
      const destination = req.body.destination ?? null;
      const estimated_delivery = req.body.estimatedDelivery ?? req.body.estimated_delivery ?? null;
      const current_location = req.body.currentLocation ?? req.body.current_location ?? null;
      const customer_name = req.body.customerName ?? req.body.customer_name ?? null;
      const customer_email = req.body.customerEmail ?? req.body.customer_email ?? null;
      const customer_phone = req.body.customerPhone ?? req.body.customer_phone ?? null;
      const weight = req.body.weight ?? null;
      const dimensions = req.body.dimensions ?? null;
      const value = req.body.value ?? null;

      // Insert shipment (use null for any missing values)
      const [result] = await connection.execute(`
        INSERT INTO shipments (
          tracking_number, status, service, origin, destination,
          estimated_delivery, current_location, customer_name,
          customer_email, customer_phone, weight, dimensions, value
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        tracking_number ?? null,
        status ?? null,
        service ?? null,
        origin ?? null,
        destination ?? null,
        estimated_delivery ?? null,
        current_location ?? null,
        customer_name ?? null,
        customer_email ?? null,
        customer_phone ?? null,
        weight ?? null,
        dimensions ?? null,
        value ?? null
      ]);

      // If the client provided events array, insert them as shipment_events
      const providedEvents = Array.isArray(req.body.events) ? req.body.events : null;
      if (providedEvents && providedEvents.length > 0) {
        for (const ev of providedEvents) {
          // prefer provided fields, fallback to CURDATE/CURTIME when missing
          const evDate = ev.date ?? null;
          const evTime = ev.time ?? null;
          const evLocation = ev.location ?? null;
          const evStatus = ev.status ?? null;
          const evDescription = ev.description ?? null;

          await connection.execute(`
            INSERT INTO shipment_events (
              shipment_id, date, time, location, status, description
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
            result.insertId,
            evDate,
            evTime,
            evLocation,
            evStatus,
            evDescription
          ]);
        }
      } else {
        // Add initial event if none provided
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
      }

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
router.put('/:id',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  param('id').isInt({ gt: 0 }),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
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
router.delete('/:id',
  authenticateToken,
  authorizeRoles('admin'),
  param('id').isInt({ gt: 0 }),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
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
router.post('/:id/events',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  param('id').isInt({ gt: 0 }),
  body('date').optional().isISO8601(),
  body('time').optional().matches(/^\d{2}:\d{2}/),
  body('location').optional().isString().isLength({ min: 2, max: 100 }).trim().escape(),
  body('status').optional().isString().isLength({ min: 2, max: 50 }).trim().escape(),
  body('description').optional().isString().isLength({ min: 2, max: 500 }).trim().escape(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
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