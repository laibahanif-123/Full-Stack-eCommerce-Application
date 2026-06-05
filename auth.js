// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Look for the token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split "Bearer TOKEN_STRING" to extract the raw token
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token signature against our environment secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Fetch user profile context from database, omitting the password field entirely
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      return next();
    } catch (error) {
      console.error('Token validation error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Guard clause middleware to restrict operations to admin accounts
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Requires administrator privileges' });
  }
};

module.exports = { protect, admin };