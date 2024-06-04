// backend/models/upload.js

const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AUTH', // Reference to the Agency model
    required: true
  },
  title: {
    type: String,
    required: true
  },
  placeName: {
    type: String,
    required: true
  },
  StartEndPoint: {
    type: String,
    required: true
  },
  photos: {
    type: [String], // Array of photo URLs
    required: true
  },
  visitDate: {
    type: String,
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
  HotelName: {
    type: String, 
  },
  CheckInOut: {
    type: String,
  },
  accessibility: {
    type: String,
  },
  phoneNumber: { // Ensure this field is included and required
    type: String,
    required: true
  }
  // Add other fields as needed
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
