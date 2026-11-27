import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';

// Routes
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

const defaultAllowedOrigins = [
  'https://cydexdigital.com',
  'https://www.cydexdigital.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...configuredOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server, or same-origin)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Allow explicitly listed origins
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow all Vercel preview or production deployments for this project
    if (/^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Fail silently without crashing the server process with an unhandled 500 error
    return callback(null, false);
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
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],

  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ======================================
// 3. Body Parser & Cookie Parser
// ======================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cydex_cookie_secret_key'));

// ======================================
// 4. Logger (Development only)
// ======================================

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ======================================
// 5. Health Check & Root Routes (Before DB Middleware)
// Must succeed immediately without waiting for DB
// ======================================

// GET / - Root route for direct browser and Vercel verification
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'API is running',
    message: 'Cydex Digital Backend API',
    environment: process.env.NODE_ENV || 'production',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// GET /health and /api/v1/health
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'API is running',
    success: true,
    message: 'Cydex Digital API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// ======================================
// 6. Safe MongoDB Connection Middleware
// Only applied to business API routes
// ======================================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Database Middleware Error]:', error.message);

    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGODB_URI is set and IP 0.0.0.0/0 is allowed in MongoDB Atlas.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ======================================
// 7. API Routes (Mounted under /api/v1 and /api)
// ======================================

const routeList = [
  ['/auth', authRoutes],
  ['/services', serviceRoutes],
  ['/portfolio', portfolioRoutes],
  ['/contact', inquiryRoutes],
  ['/inquiries', inquiryRoutes],
  ['/client-projects', clientProjectRoutes],
  ['/messages', messageRoutes],
  ['/notifications', notificationRoutes],
  ['/blog', blogRoutes],
  ['/testimonials', testimonialRoutes],
  ['/team', teamRoutes],
  ['/media', mediaRoutes],
  ['/settings', settingsRoutes],
  ['/admin', adminRoutes]
];

routeList.forEach(([path, router]) => {
  // Support both canonical /api/v1/... and /api/... aliases
  app.use(`/api/v1${path}`, router);
  app.use(`/api${path}`, router);
});

// ======================================
// 8. 404 Not Found Middleware
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// ======================================
// 9. Centralized Error Handler
// ======================================

app.use(errorHandler);

// ======================================
// 10. Export Express App for Vercel Serverless
// ======================================

export default app;
export { app };
