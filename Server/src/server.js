import dns from 'dns';

// Fix for Windows Node.js querySrv ECONNREFUSED on MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setting custom DNS servers is disallowed
}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { verifySmtpConfig } from './services/emailService.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  CYDEX DIGITAL API SERVER RUNNING ON PORT ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  API Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`===============================================`);

    // Verify SMTP diagnostic status at startup
    verifySmtpConfig().then((smtp) => {
      if (smtp.verified) {
        console.log(`[SMTP] ✅ Gmail SMTP authenticated successfully (${smtp.user} -> ${smtp.host}:${smtp.port})`);
      } else {
        console.warn(`[SMTP] ⚠️ Gmail SMTP notice: ${smtp.message}`);
      }
    }).catch((err) => {
      console.warn(`[SMTP] Verification check error: ${err.message}`);
    });
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
