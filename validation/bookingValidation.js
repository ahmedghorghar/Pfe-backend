// backend/validation/bookingValidation.js

const { check, validationResult } = require("express-validator");

const validateCreateBooking = [
  check("placeId").not().isEmpty().withMessage("Place ID is required"),
  check("agencyId").not().isEmpty().withMessage("Agency ID is required"),
  check("visitDate").not().isEmpty().withMessage("Visit Date is required"),
  check("placeName").not().isEmpty().withMessage("Place Name is required"),
  check("img").not().isEmpty().withMessage("Image is required"),
  check("title").not().isEmpty().withMessage("Title is required"),
  check("price").not().isEmpty().withMessage("Price is required"),
  check("userName").not().isEmpty().withMessage("User Name is required"),
  check("userEmail").isEmail().withMessage("Valid Email is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateCreateBooking };
