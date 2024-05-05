//backend/config/db.js

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

// Validate environment variables
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI);
// Store the mongoose connection object
const db = mongoose.connection;

// Handle connection events
db.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Export the mongoose connection object
module.exports = db;
