import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Test remote database connection
router.get('/test-connection', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Test basic connection
    const [result] = await connection.query('SELECT 1 as test');
    
    // Get database information
    const [dbInfo] = await connection.query('SELECT VERSION() as version, DATABASE() as database');
    
    // Get table information
    const [tables] = await connection.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_schema = DATABASE() 
         AND information_schema.columns.table_name = information_schema.tables.table_name
        ) as column_count
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Successfully connected to remote database',
      data: {
        connection: {
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          version: dbInfo[0].version
        },
        tables: tables.map(t => ({
          name: t.table_name,
          columns: t.column_count
        }))
      }
    });
  } catch (error) {
    console.error('Remote database connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to remote database',
      error: {
        code: error.code,
        message: error.message,
        errno: error.errno
      }
    });
  }
});

export default router;