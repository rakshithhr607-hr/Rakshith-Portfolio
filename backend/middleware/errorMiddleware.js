import mongoose from 'mongoose';

// Guard against silent ephemeral saves in production when MongoDB Atlas is unreachable
export const requireDatabaseInProduction = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

  if (isProduction && isWriteMethod) {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable. Please try again shortly.',
      });
    }
  }

  next();
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with specified ID';
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size is too large. Maximum size allowed is 10MB.';
  }

  res.status(statusCode).json({
    success: false,
    message: message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
