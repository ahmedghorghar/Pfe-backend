// backend/middleware/checkToken.js

const jwt = require("jsonwebtoken");
const verifyUser = require("./verify_user");
const verifyAgency = require("./verify_agency");

const checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];

    // Decode the token to determine its type (user or agency)
    const decodedToken = jwt.decode(token);

    // Determine the secret key based on the type of token (user or agency)
    let secret;
    let middleware;
    if (decodedToken && decodedToken.type === "user") {
      secret = process.env.JWT_SECRET_USER;
      middleware = verifyUser;
    } else if (decodedToken && decodedToken.type === "agency") {
      secret = process.env.JWT_SECRET_AGENCY;
      middleware = verifyAgency;
    } else {
      return res.status(401).json({ message: "Invalid token type" });
    }

    // Verify the token using the appropriate secret key
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error("Error in token verification:", err);
        return res.status(401).json({ message: "Invalid token" });
      }
      req.decoded = decoded;
      middleware(req, res, next);
    });
  } catch (error) {
    console.error("Error in token verification:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = checkToken;
