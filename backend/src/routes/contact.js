import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import emailService from '../services/emailService.js';

const router = express.Router();

// Configure multer for serverless environment (use /tmp directory)
const upload = multer({
  dest: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Basic contact form: accepts name, email, message and optional attachment (image/pdf)
router.post('/',
  upload.single('attachment'),
  body('name').isString().isLength({ min: 2, max: 100 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').isString().isLength({ min: 5, max: 2000 }).trim().escape(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Remove uploaded file on validation error (async)
    if (req.file) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (err) {
        console.warn('Failed to delete file:', err.message);
      }
    }
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
  try {
    const { name, email, message } = req.body;
    const file = req.file;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate file type if present
    if (file) {
      const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.pdf'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.includes(ext)) {
        // remove file (async)
        try {
          await fs.promises.unlink(file.path);
        } catch (err) {
          console.warn('Failed to delete file:', err.message);
        }
        return res.status(400).json({ success: false, message: 'Invalid file type' });
      }
    }

    // Send email using email service
    emailService.sendContactEmail(
      name,
      email,
      message,
      file ? file.path : null,
      file ? file.originalname : null
    )
      .then(async () => {
        // remove the temporary file after sending (async)
        if (file) {
          try {
            await fs.promises.unlink(file.path);
          } catch (err) {
            console.warn('Failed to delete file:', err.message);
          }
        }
        return res.json({ success: true, message: 'Enquiry sent' });
      })
      .catch(async (err) => {
        // remove the temporary file on error (async)
        if (file) {
          try {
            await fs.promises.unlink(file.path);
          } catch (deleteErr) {
            console.warn('Failed to delete file:', deleteErr.message);
          }
        }
        console.error('Error sending contact email:', err);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
      });

  } catch (error) {
    console.error('Contact route error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
