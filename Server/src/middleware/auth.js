import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    let token = null;

    // Check cookie first (primary secure cookie method)
    if (req.cookies && (req.cookies.cydex_token || req.cookies.token)) {
      token = req.cookies.cydex_token || req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      // Fallback for authorization header
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cydex_super_secret_jwt_key_2026_dev_secure_token_998877');

    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session invalid. Account not found.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact Cydex Digital support.',
      });
    }

    // Attach user to request without sensitive password
    user.password = undefined;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Access restricted to [${roles.join(', ')}] roles.`,
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies && (req.cookies.cydex_token || req.cookies.token)) {
      token = req.cookies.cydex_token || req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cydex_super_secret_jwt_key_2026_dev_secure_token_998877');
      const user = await User.findById(decoded.id);
      if (user && user.status !== 'suspended') {
        req.user = user;
      }
    }
  } catch (err) {
    // optional, ignore
  }
  next();
};
