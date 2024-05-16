
// backend/middleware/verify_user.js

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not provided" });
        }
        console.log('authHeader:', authHeader)

        const token = authHeader.split(" ")[1];
        console.log('token:', token)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_USER);
        console.log('decodedToken:', decodedToken)
        // Ensure that the decoded token contains the user ID
        if (!decodedToken || !decodedToken.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.decoded = decodedToken;
        next();
    } catch (error) {
        console.error('Error in verifying user:', error);
        return res.status(401).json({ message: 'Authentication for user failed' });
    }
};
