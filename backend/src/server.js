import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import authRoutes from './routes/auth.js';
import shipmentRoutes from './routes/shipments.js';
import testRoutes from './routes/test.js';
import dbTestRoutes from './routes/db-test.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from src/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

export default app; // Export for testing

// Debug: Log environment variables (excluding sensitive data)
console.log('Environment Variables Check:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  NODE_ENV: process.env.NODE_ENV
});

// Create MySQL connection pool with remote database settings
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 60000, // Increased timeout for remote connection
  ssl: false, // Disable SSL for freesqldatabase.com
  debug: process.env.NODE_ENV === 'development'
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/test', testRoutes);
app.use('/api/db', dbTestRoutes);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Test MySQL connection and start server
async function startServer() {
  try {
    // Test the connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();

    // Start the server
    const port = process.env.PORT || 5000;
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
}

// Start the server
startServer();