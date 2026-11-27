import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

// ======================================
// 1. Load Environment Variables
// ======================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '../.env')
});

// ======================================
// 2. Local DNS Configuration
// ======================================

// Only apply custom DNS settings locally. Do not override DNS settings on Vercel.
if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (error) {
    console.warn('[DNS] Custom DNS configuration unavailable');
  }
}

// ======================================
// 3. Local Development Server
// Wrap app.listen() so Vercel serverless doesn't attempt to open a port
// ======================================

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;

  const startServer = async () => {
    try {
      const server = app.listen(PORT, () => {
        console.log('===============================================');
        console.log('       CYDEX DIGITAL API SERVER');
        console.log('===============================================');
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Port: ${PORT}`);
        console.log(`API URL: http://localhost:${PORT}/api/v1`);
        console.log(`Health: http://localhost:${PORT}/api/v1/health`);
        console.log('===============================================');
      });

      // Optional SMTP check in local dev
      try {
        const { verifySmtpConfig } = await import('./services/emailService.js');
        verifySmtpConfig()
          .then((smtp) => {
            if (smtp.verified) {
              console.log(`[SMTP] Gmail authenticated: ${smtp.user}`);
            } else {
              console.warn(`[SMTP] ${smtp.message}`);
            }
          })
          .catch((error) => {
            console.warn('[SMTP] Verification notice:', error.message);
          });
      } catch (err) {
        // Ignore if email service config is not present
      }

      server.on('error', (error) => {
        console.error('[SERVER ERROR]:', error.message);
      });
    } catch (error) {
      console.error('[STARTUP ERROR]:', error);
    }
  };

  startServer();
}

// ======================================
// 4. Export Express App for Vercel
// ======================================

export default app;
export { app };
