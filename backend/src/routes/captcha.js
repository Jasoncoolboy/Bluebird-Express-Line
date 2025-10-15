import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/verify', async (req, res) => {
  try {
    if (process.env.CAPTCHA_REQUIRED !== 'true') {
      return res.json({ success: true, skipped: true });
    }

    const { token } = req.body || {};
    if (!token) {
      return res.status(400).json({ success: false, message: 'Missing captcha token' });
    }

    const provider = process.env.CAPTCHA_PROVIDER || 'turnstile';
    const secret = process.env.CAPTCHA_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Captcha not configured' });
    }

    let verifyUrl;
    const form = new URLSearchParams();
    if (provider === 'hcaptcha') {
      verifyUrl = 'https://hcaptcha.com/siteverify';
      form.append('secret', secret);
      form.append('response', token);
    } else {
      // Cloudflare Turnstile
      verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      form.append('secret', secret);
      form.append('response', token);
    }

    const resp = await fetch(verifyUrl, { method: 'POST', body: form });
    const data = await resp.json();
    if (data.success) {
      return res.json({ success: true });
    }
    return res.status(400).json({ success: false, message: 'Captcha failed', provider: provider });
  } catch (e) {
    console.error('Captcha verify error', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

