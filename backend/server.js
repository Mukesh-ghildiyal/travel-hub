const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const destinationRoutes = require('./routes/destinations');
const hotelRoutes = require('./routes/hotels');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://clinquant-maamoul-9bcfc6.netlify.app/']
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
// app.use(morgan('combined')); // Logging disabled
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TravelHub API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/hotels', hotelRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/destinations',
      'POST /api/destinations',
      'GET /api/destinations/:id',
      'PUT /api/destinations/:id',
      'DELETE /api/destinations/:id',
      'GET /api/destinations/:id/hotels',
      'GET /api/hotels',
      'POST /api/hotels',
      'GET /api/hotels/:id',
      'PUT /api/hotels/:id',
      'DELETE /api/hotels/:id',
      'GET /api/hotels/destination/:destinationId',
      'GET /api/hotels/search/filter'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TravelHub API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

module.exports = app;

