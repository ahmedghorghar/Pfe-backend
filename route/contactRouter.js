// backend/route/contactsRouter.js

// Import required modules
const express = require('express');
const router = express.Router();
const { insertContact, getContact } = require('../logic/contactsLogic'); // Import insertContact and getContact functions from contactsLogic

// Route for inserting a new contact
router.post('/', insertContact); // Call insertContact function when POST request is made to the root route '/'

// Route for retrieving all contacts
router.get('/', getContact); // Call getContact function when GET request is made to the root route '/'

// Export the router
module.exports = router;
