
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ======================================
// 1. DNS Configuration
// ======================================

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn('[DNS] Custom DNS configuration unavailable');
}

// ======================================
// 2. Load Environment Variables FIRST
// ======================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '../.env')
});

// ======================================
// 3. Import App After Loading .env
// ======================================

const { default: app } = await import('./app.js');

const { connectDB } = await import('./config/db.js');

const { verifySmtpConfig } = await import('./services/emailService.js');

// ======================================
// 4. Server Configuration
// ======================================

const PORT = process.env.PORT || 5000;

// ======================================
// 5. Start Server
// ======================================

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    console.log('[MongoDB] Database connected successfully');

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

    // Verify SMTP Configuration
    verifySmtpConfig()
      .then((smtp) => {
        if (smtp.verified) {
          console.log(
            `[SMTP] Gmail authenticated: ${smtp.user}`
          );
        } else {
          console.warn(`[SMTP] ${smtp.message}`);
        }
      })
      .catch((error) => {
        console.warn('[SMTP] Verification error:', error.message);
      });

    // Handle Server Errors
    server.on('error', (error) => {
      console.error('[SERVER ERROR]:', error.message);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (error) => {
      console.error('[UNHANDLED REJECTION]:', error);

      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('[STARTUP ERROR]:', error);
    process.exit(1);
  }
};

startServer();
