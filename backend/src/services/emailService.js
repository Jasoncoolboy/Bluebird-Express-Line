import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });
  }

  async sendContactEmail(name, email, message, attachmentPath = null, attachmentName = null) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@bluebird.com.my',
      to: process.env.CONTACT_EMAIL || 'enquiry@bluebird.com.my',
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      attachments: attachmentPath ? [{ filename: attachmentName, path: attachmentPath }] : []
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
