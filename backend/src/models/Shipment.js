import pool from '../config/database.js';

class Shipment {
  static async findAll() {
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
      `);
      return shipments;
    } catch (error) {
      console.error('Error finding shipments:', error);
      throw error;
    }
  }

  static async findByTrackingNumber(trackingNumber) {
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
      `, [trackingNumber]);
      return shipments[0];
    } catch (error) {
      console.error('Error finding shipment:', error);
      throw error;
    }
  }

  static async create(shipmentData) {
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
    } = shipmentData;

    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
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

        await connection.commit();
        connection.release();
        return { id: result.insertId, ...shipmentData };
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  }

  static async update(id, shipmentData) {
    try {
      const [result] = await pool.execute(`
        UPDATE shipments 
        SET ?
        WHERE id = ?
      `, [shipmentData, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM shipments WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw error;
    }
  }

  static async addEvent(shipmentId, eventData) {
    const { date, time, location, status, description } = eventData;
    try {
      const [result] = await pool.execute(`
        INSERT INTO shipment_events (
          shipment_id, date, time, location, status, description
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [shipmentId, date, time, location, status, description]);
      return { id: result.insertId, ...eventData };
    } catch (error) {
      console.error('Error adding shipment event:', error);
      throw error;
    }
  }
}

export default Shipment;