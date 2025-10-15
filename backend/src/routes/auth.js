import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import nodemailer from 'nodemailer';

// Simple in-memory rate limiter (IP -> { attempts, lastAttempt })
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Optional transporter for alerts (configure SMTP in env)
const alertTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
});

const router = express.Router();

// Debug route to create a new admin with known password
router.post('/setup-admin', async (req, res) => {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Generated hash for admin123:', hashedPassword);

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.execute(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, 'admin']
      );
      
      console.log('Admin password updated successfully');
      res.json({ success: true, message: 'Admin password updated' });
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ success: false, message: 'Database error' });
    } finally {
      if (connection) connection.release();
    }
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, message: 'Setup failed' });
  }
});

// Login route
router.post('/login',
  body('username').isString().isLength({ min: 3, max: 50 }).trim().escape(),
  body('password').isString().isLength({ min: 6, max: 200 }),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Rate limiter by IP
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const record = loginAttempts.get(ip) || { attempts: 0, lastAttempt: 0 };
    if (record.lastAttempt && (now - record.lastAttempt) < WINDOW_MS && record.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'Too many login attempts. Try again later.' });
    }

    // Get user from database
    let connection;
    let user;
    
    try {
      console.log('Attempting login for username:', username);
      connection = await pool.getConnection();
      
      // Log the actual SQL query for debugging
      const sql = 'SELECT * FROM users WHERE username = ?';
      console.log('Executing SQL:', sql, 'with params:', [username]);
      
      const [users] = await connection.execute(sql, [username]);
      console.log('Database response:', users);

      user = users[0];

      if (!user) {
        // increment attempts
        loginAttempts.set(ip, { attempts: (record.attempts || 0) + 1, lastAttempt: now });
        if ((record.attempts || 0) + 1 >= MAX_ATTEMPTS) {
          // Send alert email to admin if configured
          try {
            if (process.env.ALERT_EMAIL) {
              alertTransporter.sendMail({
                from: process.env.SMTP_FROM || 'no-reply@bluebird.com.my',
                to: process.env.ALERT_EMAIL,
                subject: 'Repeated failed login attempts detected',
                text: `Multiple failed login attempts from IP ${ip} for username ${username}`
              });
            }
          } catch (e) {
            console.error('Failed to send alert email:', e);
          }
        }
        console.log('No user found with username:', username);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      
      console.log('User found:', { id: user.id, username: user.username, role: user.role });

      // Compare password
      console.log('Comparing password hash...');
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);

      if (!isMatch) {
        // increment attempts
        loginAttempts.set(ip, { attempts: (record.attempts || 0) + 1, lastAttempt: now });
        if ((record.attempts || 0) + 1 >= MAX_ATTEMPTS) {
          try {
            if (process.env.ALERT_EMAIL) {
              alertTransporter.sendMail({
                from: process.env.SMTP_FROM || 'no-reply@bluebird.com.my',
                to: process.env.ALERT_EMAIL,
                subject: 'Repeated failed login attempts detected',
                text: `Multiple failed login attempts from IP ${ip} for username ${username}`
              });
            }
          } catch (e) {
            console.error('Failed to send alert email:', e);
          }
        }
        console.log('Password does not match');
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      console.log('Password matches successfully');

      // On successful login, reset attempts for this IP
      loginAttempts.delete(ip);

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id.toString(),  // Convert to string as frontend expects string
            username: user.username,
            role: user.role
          }
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection error' 
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Optional: enforce admin-only endpoints using req.user.role downstream
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

export default router;