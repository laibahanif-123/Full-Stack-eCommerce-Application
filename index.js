// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Route Submodule Registry Imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

const app = express();

// System Structural Middlewares Initialization
app.use(cors());
app.use(express.json());

// Application API Endpoints Router Routing Declarations
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Base healthcheck routing interface verification parameter
app.get('/', (req, res) => {
  res.json({ status: 'online', messaging: 'ShopHub fullstack platform engine functional' });
});

// Central Application Error Handling Middleware Core Catch Block 
app.use((err, req, res, next) => {
  console.error('Unhandled runtime exceptions:', err.stack);
  res.status(500).json({ message: 'An internal application pipeline fault occurred', details: err.message });
});

// MongoDB Core Database Connectivity Establishment Routine Execution Block
const MONGODB_CONNECT_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Ecommerce';
const APPLICATION_SERVER_PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_CONNECT_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB cluster instance datastores');
    app.listen(APPLICATION_SERVER_PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${APPLICATION_SERVER_PORT}`);
    });
  })
  .catch((databaseConnectionError) => {
    console.error('Database instantiation failure exception standard error:', databaseConnectionError.message);
    process.exit(1);
  });