import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'rakshith_portfolio_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        // Fallback for in-memory or seeded admin token
        req.admin = { id: decoded.id, email: decoded.email, role: decoded.role || 'admin' };
      }
      return next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};
