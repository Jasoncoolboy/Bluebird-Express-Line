import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

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
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
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
        console.log('Password does not match');
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      console.log('Password matches successfully');

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
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

export default router;