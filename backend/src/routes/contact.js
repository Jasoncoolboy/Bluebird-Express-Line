import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import emailService from '../services/emailService.js';

const router = express.Router();

// Configure multer for small temporary storage
const upload = multer({
  dest: path.join(process.cwd(), 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Basic contact form: accepts name, email, message and optional attachment (image/pdf)
router.post('/', upload.single('attachment'), async (req, res) => {
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
        // remove file
        fs.unlinkSync(file.path);
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
      .then(() => {
        // remove the temporary file after sending
        if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return res.json({ success: true, message: 'Enquiry sent' });
      })
      .catch((err) => {
        // remove the temporary file on error
        if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
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
