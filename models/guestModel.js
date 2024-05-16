// backend/models/guestModel.js

const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  guestID: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
