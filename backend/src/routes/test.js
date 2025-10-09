import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Test query to check database schema
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME]);
    
    // Test query for users table
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    // Test query for shipments table
    const [shipments] = await connection.query('SELECT COUNT(*) as count FROM shipments');
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        tables: tables.map(t => t.table_name),
        counts: {
          users: users[0].count,
          shipments: shipments[0].count
        }
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

export default router;