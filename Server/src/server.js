
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Only apply custom DNS settings locally.
// Do not override DNS settings on Vercel.

if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (error) {
    console.warn('[DNS] Custom DNS configuration unavailable');
  }
}

// ======================================
// 3. Import App After Loading .env
// ======================================

const { default: app } = await import('./app.js');

// ======================================
// 4. Local Development Server
// ======================================

if (!process.env.VERCEL) {

  const { verifySmtpConfig } = await import(
    './services/emailService.js'
  );

  const PORT = process.env.PORT || 5001;

  const startServer = async () => {
    try {

      // Start Express Server
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

      // SMTP Verification (Local Only)
      verifySmtpConfig()
        .then((smtp) => {

          if (smtp.verified) {
            console.log(`[SMTP] Gmail authenticated: ${smtp.user}`);
          } else {
            console.warn(`[SMTP] ${smtp.message}`);
          }

        })
        .catch((error) => {
          console.warn('[SMTP] Verification error:', error.message);
        });

      // Server Error Handling
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
// 5. Export Express App for Vercel
// ======================================

export default app;
