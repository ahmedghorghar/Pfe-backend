// backend/validation/bookingValidation.js

const { body, validationResult } = require('express-validator');

// Validation middleware for creating a new booking
exports.validateCreateBooking = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('placeId').notEmpty().withMessage('Place ID is required'),
  body('visitDate').notEmpty().withMessage('Visit date is required').isISO8601().toDate().withMessage('Invalid visit date format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
