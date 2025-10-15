Netlify Environment Variables

Set these in Netlify Site settings -> Build & deploy -> Environment.

Frontend (Vite)
- VITE_API_BASE_URL: Leave empty to use Netlify Functions via `/api`. Or set to your absolute API (e.g., `https://your-site.netlify.app/.netlify/functions/api`).
- VITE_SITE_URL: Optional, your site URL for CORS/UI.

Backend (Functions)
- NODE_ENV: production
- JWT_SECRET: Strong secret for signing JWTs
- FRONTEND_URL: Your deployed front-end origin (e.g., `https://your-site.netlify.app`)

Database (MySQL)
- DB_HOST
- DB_PORT (e.g., 3306)
- DB_USER
- DB_PASSWORD
- DB_DATABASE

Email (optional)
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE (true|false)
- SMTP_USER
- SMTP_PASS
- SMTP_FROM
- ALERT_EMAIL (receive alerts for repeated login failures)

CAPTCHA (optional, for login/contact)
- CAPTCHA_REQUIRED: true|false
- CAPTCHA_PROVIDER: turnstile|hcaptcha
- CAPTCHA_SECRET: provider secret key

Notes
- Do NOT prefix server-only secrets with `VITE_`.
- VITE_ variables are exposed to the client and must not contain secrets.

