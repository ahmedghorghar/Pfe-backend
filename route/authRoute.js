// backend/route/authRoute.js

// Import required modules
const express = require("express");
const router = express.Router();
const { signup, login } = require("../logic/authLogic"); // Import signup and login functions
const { body, validationResult } = require("express-validator"); // Import body function for validation
const PasswordReset = require("../logic/passwordResetLogic");
const jwt = require('jsonwebtoken');
const User = require('../model/AuthModel')

// Route for user signup
router.post(
  "/signup",
  [
    // Validate and sanitize fields using express-validator
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    // Add validation for user type
    body("type").isIn(["user", "agency"]).withMessage("Invalid user type"), // Validate user type
  ],
  async (req, res) => {
    // Use async for cleaner handling of validation errors
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
      }

      // Pass request body directly to signup function (no need to extract fields manually)
      await signup(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route for user login
router.post(
  "/login",
  [
    // Validate fields as before

    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Use async for cleaner handling of validation errors
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
      }

      // Pass request body directly to login function
      await login(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const passwordResetInstance = new PasswordReset();
// Route for sending a password link
router.post('/sendpasswordlink', (req, res) => passwordResetInstance.sendVerificationCode(req, res));

// Route to verify verification code
router.post('/verify-reset-code', (req, res) => passwordResetInstance.verifyResetCode(req, res));

// router.post('/handle-user-request/:type', (req,res) => passwordResetInstance.sendVerificationCode(req, res));
// Route to change password
// Utilize the already created instance at the top of the file
router.post('/change-password/:email/:token', async (req, res) => {
  try {
    console.log('Change Password Route Hit');
    const { email, token } = req.params;
    const { newPassword } = req.body;

    // Perform authentication here before changing the password
    // For example, verify the token and user identity

    // If authentication is successful, proceed to change the password
    await passwordResetInstance.changePassword(email, token, newPassword);
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.route("/update/:name").patch((req, res) => {
  User.findOneAndUpdate(
    { name: req.params.name },
    {$set: {password : req.body.password}},
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      const msg = {
        msg: "password successfully updated",
       name: req.params.name,
    };
    return res.json(msg);
    }
  );
})

router.route('/delete/:name').delete((req, res) => {
  User.findOneAndDelete(
    {name: req.params.name},
    (err, result) =>  {
      if (err) return res.status(500).json({msg: err});
      const msg = {
        msg: "user deleted",
        name: req.params.name
      };
      return res.json(msg);
    }
  );
})


// Export the router
module.exports = router;
