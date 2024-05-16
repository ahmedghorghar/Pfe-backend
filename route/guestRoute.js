// backend/route/guestRoute.js

const express = require('express');
const router = express.Router();
const guest = require('../logic/guest.controller');

// Route to generate anonymous user IDs for visitors
router.post('/generate-id-Guest', guest.GenerateGuest)


  

module.exports = router;
