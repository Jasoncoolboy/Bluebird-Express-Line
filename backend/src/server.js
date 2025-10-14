import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pool from './config/database.js';
import authRoutes from './routes/auth.js';
import shipmentRoutes from './routes/shipments.js';
import testRoutes from './routes/test.js';
import dbTestRoutes from './routes/db-test.js';
import contactRoutes from './routes/contact.js';
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

// Only log the NODE_ENV in startup; avoid logging DB credentials in production
if (process.env.NODE_ENV === 'development') {
  console.log('Starting server in development mode');
} else {
  console.log(`Starting server in ${process.env.NODE_ENV || 'production'} mode`);
}

// Database pool is now imported from config/database.js

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/test', testRoutes);
app.use('/api/db', dbTestRoutes);
app.use('/api/contact', contactRoutes);

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