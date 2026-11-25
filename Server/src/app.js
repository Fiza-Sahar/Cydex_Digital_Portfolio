import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import clientProjectRoutes from './routes/clientProjectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration with strict origin enforcement
const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // In production, strictly enforce allowed frontend origins
      if (process.env.NODE_ENV === 'production') {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
      // Local development fallback
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cydex_cookie_secret_key'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files for media uploads with proper headers for APK packages
const uploadsDir = path.join(__dirname, '../uploads');
app.use(
  '/uploads',
  express.static(uploadsDir, {
    setHeaders: (res, pathStr) => {
      if (pathStr.toLowerCase().endsWith('.apk')) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        const filename = path.basename(pathStr);
        let downloadName = 'app-release.apk';
        if (filename.toLowerCase().includes('campuslink')) {
          downloadName = 'CampusLink-release.apk';
        } else if (filename.toLowerCase().includes('baby')) {
          downloadName = 'BabyShop-release.apk';
        } else {
          downloadName = filename;
        }
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
      }
    },
  })
);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cydex Digital API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

// Mount versioned API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/contact', inquiryRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/client-projects', clientProjectRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler for unmatched API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Middleware
app.use(errorHandler);

export default app;
