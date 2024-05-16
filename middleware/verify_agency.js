// backend/middleware/verify_agency.js

const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log("Authorization Header:", token);
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not provided" });
    }
    const tokenValue = token.split(" ")[1]; // Extract token value
    // console.log("Token:", tokenValue); // Log the token value
    // console.log("JWT_SECRET_AGENCY:", process.env.JWT_SECRET_AGENCY); // Log the secret key
    const decode = jwt.verify(tokenValue, process.env.JWT_SECRET_AGENCY); // Verify token using tokenValue
    // console.log("Decoded Token:", decode); // Log the decoded payload
    req.userData = decode;
    next();
  } catch (error) {
    console.error("Error in verifying agency:", error);
    return res
      .status(401)
      .json({ message: "Authentication for agency failed" });
  }
};
