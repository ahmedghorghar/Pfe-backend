// backend/middleware/admin.middl.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: 'admin.env' });

// Middleware function to authenticate admin using JWT token
const adminAuth = (req, res, next) => {
  try {
    // Check if token is provided in headers
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    // Extract token value
    const tokenValue = token.split(' ')[1];

    // Verify token using admin secret key
    const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET_ADMIN);

    // Attach decoded token to request object
    req.admin = decodedToken;

    next();
  } catch (error) {
    console.error('Error in admin authentication:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminAuth;