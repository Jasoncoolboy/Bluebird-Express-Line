import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

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

    // Prepare email (note: this requires SMTP settings in env)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@bluebird.com.my',
      to: process.env.CONTACT_EMAIL || 'enquiry@bluebird.com.my',
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      attachments: file ? [ { filename: file.originalname, path: file.path } ] : []
    };

    // Send email (don't block on slow mail servers)
    transporter.sendMail(mailOptions, (err, info) => {
      // remove the temporary file after sending
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      if (err) {
        console.error('Error sending contact email:', err);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
      }
      return res.json({ success: true, message: 'Enquiry sent' });
    });

  } catch (error) {
    console.error('Contact route error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
