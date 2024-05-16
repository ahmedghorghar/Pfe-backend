// backend/models/upload.js

const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency', // Reference to the Agency model
    required: true
  },
  placeName: {
    type: String,
    required: true
  },
  photos: {
    type: [String], // Array of photo URLs
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String, // You can specify the duration format (e.g., "2 hours", "half-day", "3 days")
    required: true
  },
  tags: {
    type: [String], // Array of tags describing the place (e.g., "romantic", "family-friendly", "historic")
    required: true
  },
  accessibility: {
    type: String, // Describe the accessibility features of the place (e.g., "wheelchair accessible", "ADA compliant")
    required: true
  },
  // Add other fields as needed
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;


