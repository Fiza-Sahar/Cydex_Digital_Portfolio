
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';

// Import Routes
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

// ======================================
// 1. Security Middleware
// ======================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

// ======================================
// 2. CORS Configuration
// ======================================

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

const corsOptions = {
  origin: (origin, callback) => {

    // Allow requests without an origin
    if (!origin) {
      return callback(null, true);
    }

    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Allow configured origins in production
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS blocked origin: ${origin}`)
    );
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
};

app.use(cors(corsOptions));

// ======================================
// 3. Body Parser
// ======================================

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

// ======================================
// 4. Cookie Parser
// ======================================

app.use(
  cookieParser(
    process.env.COOKIE_SECRET || 'cydex_cookie_secret_key'
  )
);

// ======================================
// 5. Morgan Logger
// ======================================

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ======================================
// 6. Static Uploads Folder
// ======================================

const uploadsDir = path.join(__dirname, '../uploads');

app.use(
  '/uploads',
  express.static(uploadsDir)
);

// ======================================
// 7. Basic Health Check
// ======================================

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cydex Digital API is running',
    timestamp: new Date().toISOString()
  });
});

// ======================================
// 8. MongoDB Connection Middleware
// ======================================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Database Error]:', error.message);

    res.status(503).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

// ======================================
// 9. API Routes
// ======================================

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

// ======================================
// 10. Not Found Middleware
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// ======================================
// 11. Error Handler
// ======================================

app.use(errorHandler);

// ======================================
// 12. Export App
// ======================================

export default app;
