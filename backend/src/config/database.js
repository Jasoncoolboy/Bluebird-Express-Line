import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle serverless environment where import.meta.url might be undefined
const __filename = import.meta.url ? fileURLToPath(import.meta.url) : process.cwd() + '/src/config/database.js';
const __dirname = path.dirname(__filename);

// Load environment variables (only in development, serverless provides them directly)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Create connection options object
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bluebird_DB',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000
};

// Add SSL configuration if CA certificate is provided
if (process.env.DB_CA_CERT) {
  dbConfig.ssl = {
    ca: process.env.DB_CA_CERT,
    rejectUnauthorized: true
  };
}

// Debug: Log sanitized database configuration
console.log('Database Configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  sslEnabled: !!dbConfig.ssl
});

const pool = mysql.createPool(dbConfig);

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    
    // Test the connection with a simple query
    const [result] = await connection.query('SELECT 1');
    console.log('MySQL connection test query successful');
    
    connection.release();
    return true;
  } catch (err) {
    console.error('Failed to connect to MySQL database:', err);
    if (err.code === 'ECONNREFUSED') {
      console.error('Make sure MySQL server is running on the specified host and port');
    }
    throw err;
  }
};

// Attempt connection with retry
let retryCount = 0;
const maxRetries = 3;

const attemptConnection = async () => {
  try {
    await testConnection();
  } catch (err) {
    retryCount++;
    if (retryCount < maxRetries) {
      console.log(`Connection attempt ${retryCount} failed, retrying in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return attemptConnection();
    }
    console.error(`Failed to connect after ${maxRetries} attempts`);
  }
};

attemptConnection();

export default pool;