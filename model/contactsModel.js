// backend/model/contactModel.js

// Import the mongoose module
const mongoose = require('mongoose');

// Define the schema for contact data
const contactSchema = new mongoose.Schema({
    name: String,   // Name of the contact
    phone: String   // Phone number of the contact
});

// Export the mongoose model for contacts
module.exports = mongoose.model('CONTACTS', contactSchema);
