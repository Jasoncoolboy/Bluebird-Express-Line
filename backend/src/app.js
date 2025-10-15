import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/database.js';
import authRoutes from './routes/auth.js';
import shipmentRoutes from './routes/shipments.js';
import testRoutes from './routes/test.js';
import dbTestRoutes from './routes/db-test.js';
import contactRoutes from './routes/contact.js';
import captchaRoutes from './routes/captcha.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

export function createApp() {
  const app = express();

  // Basic middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Health check useful for serverless monitoring
  app.get('/api/health', async (_req, res) => {
    try {
      const connection = await pool.getConnection();
      connection.release();
      res.json({ success: true, status: 'ok' });
    } catch (e) {
      res.status(500).json({ success: false, status: 'db_error' });
    }
  });

  // Simple request logging (avoid PII)
  app.use((req, _res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${req.method} ${req.path}`);
    }
    next();
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/shipments', shipmentRoutes);
  app.use('/api/test', testRoutes);
  app.use('/api/db', dbTestRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/captcha', captchaRoutes);

  return app;
}

export default createApp;

