//backend/middleware/checkToken.js

const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Verifying authentication token");
    let secret;
    if (req.decoded && req.decoded.type === "agency") {
      secret = process.env.JWT_SECRET_AGENCY;
    } else {
      secret = process.env.JWT_SECRET_USER;
    }

    const decode = jwt.verify(token, secret);
    req.decoded = decode;
    console.log("Authentication token verified successfully");

    next();
  } catch (error) {
    console.error("Error in token verification:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = checkToken;
