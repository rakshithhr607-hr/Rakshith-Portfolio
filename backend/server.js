import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, getDBStatus } from './config/db.js';
import { notFound, errorHandler, requireDatabaseInProduction } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration
const isProduction = process.env.NODE_ENV === 'production';
const configuredFrontendOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
      .map((url) => url.trim().replace(/\/$/, ''))
      .filter(Boolean)
  : [];

const devOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (isProduction) {
        // In production, allow ONLY the exact origins configured in FRONTEND_URL
        if (configuredFrontendOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      }

      // During development, allow localhost origins and configured FRONTEND_URL
      if (
        devOrigins.includes(normalizedOrigin) ||
        configuredFrontendOrigins.includes(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // Permissive fallback for local development
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    databaseConnected: getDBStatus(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    developer: 'Rakshith H R',
  });
});

// Guard against silent ephemeral saves in production when MongoDB is disconnected
app.use(requireDatabaseInProduction);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/stats', statsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send({
    message: 'Rakshith H R Portfolio API is running smoothly.',
    healthCheck: '/api/health',
    documentation: 'REST API endpoints active.',
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Rakshith Portfolio Backend Server running on port ${PORT} (0.0.0.0)`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
