
// backend/middleware/verify_user.js

// Import the jsonwebtoken module
const jwt = require('jsonwebtoken');

// Middleware function to verify user access
module.exports = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify and decode the token using the "USER" secret key
        const decode = jwt.verify(token,  process.env.JWT_SECRET_USER);
        // Attach the decoded user data to the request object
        req.userData = decode;
        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // Handle errors and respond with authentication failure message
        console.error('Error in verifying user:', error);
        return res.status(401).json({ message: 'Authentication for user failed' });
    }
};