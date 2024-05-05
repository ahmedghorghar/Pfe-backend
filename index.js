// backend/index.js

// Import required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit"); // Import express-rate-limit for rate limiting
const cors = require('cors');
const ContactRouter = require('./route/contactRouter'); // Import router for handling contact-related routes
const AuthRouter = require('./route/authRoute'); // Import router for handling authentication-related routes
const user_check = require('./middleware/verify_user'); // Import middleware for verifying user access
const agency_check = require('./middleware/verify_agency'); // Import middleware for verifying agency access
const passport = require('./middleware/passport'); // Import Passport middleware
const profileRoute = require("./route/profile_route");
const db = require('./config/db');
require('dotenv').config();



// Middleware and parsers
app.use([bodyParser.urlencoded({ extended: true }), cors(), express.json(), express.urlencoded({ extended: true })]);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


// Routes
app.use('/auth', AuthRouter); // Route for authentication
app.get('/contacts', user_check); // Route for retrieving contacts (accessible to users)
app.post('/contacts', agency_check); // Route for inserting contacts (accessible to agencys)
app.use('/contacts', ContactRouter); // Route for contact-related operations
app.use("/profile", profileRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
    next(err);
});


// Initialize Passport
app.use(passport.initialize());
// Example protected route using JWT authentication
// Protected route example
app.get('/protected-route', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'You have accessed a protected route' });
  });

  
// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`connected with the server on port ${port}`);
});

// Export the app
module.exports = app;
