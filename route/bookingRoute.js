// backend/route/bookingRoute.js

const express = require("express");
const router = express.Router();
const bookingLogic = require("../logic/bookingLogic");
const { validateCreateBooking } = require("../validation/bookingValidation");
const checkToken = require("../middleware/checkToken");
const Booking = require("../models/booking");
const Auth = require("../models/AuthModel");
const Place = require("../models/upload-model");

// Route to create a new booking
router.post(
  "/createBooking",
  checkToken,
  validateCreateBooking,
  async (req, res) => {
    try {
      const userId = req.decoded.id; // Assuming user ID is stored in the request object after authentication
      const { placeId, agencyId, visitDate } = req.body;

      // Check if the user already has a booking for the specified date
      const existingBooking = await Booking.findOne({
        userId,
        visitDate: {
          $gte: new Date(new Date(visitDate).setUTCHours(0, 0, 0, 0)),
          $lt: new Date(new Date(visitDate).setUTCHours(23, 59, 59, 999)),
        },
      });
      if (existingBooking) {
        return res
          .status(400)
          .json({ message: "User already has a booking for this date" });
      }

      // Fetch additional information about the user and place
      const user = await Auth.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const place = await Place.findById(placeId);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }
      // Call the booking logic function to create a new booking
      const booking = await bookingLogic.createBooking(
        userId, // Pass the userId here
        placeId,
        agencyId,
        visitDate
      );
      // Send success response
      res.status(201).json({
        message: "Booking created successfully",
        userId: userId, // Corrected to use userId here
        agencyId: agencyId,
        bookingId: booking._id, // Include the booking ID in the response
        placeId: booking.placeId, // Optionally include other relevant information
        visitDate: booking.visitDate,
        userName: user.name, // User's name
        userEmail: user.email, // User's email
        userImage: user.img, // User's image
        placeName: place.placeName, // Place name
        placeTitle: place.title, // Place title
        placePrice: place.price, // Place price
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Route to get all bookings for an agency
router.get("/getAgencyBookings/:agencyId", checkToken, async (req, res) => {
  try {
    const agencyId = req.params.agencyId;
    console.log("Fetching bookings for agency:", agencyId);

    const bookings = await bookingLogic.getAgencyBookings(agencyId);
    console.log("Bookings fetched:", bookings);

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching agency bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get all bookings for a user
router.get("/getUserBookings", checkToken, async (req, res) => {
  try {
    const userId = req.decoded.id; // Assuming user ID is stored in the request object after authentication
    const bookings = await bookingLogic.getUserBookings(userId);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to update a booking
router.put("/updateBooking/:id", checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.decoded.id; // Assuming user ID is stored in the request object after authentication
    const { placeId, visitDate, status } = req.body;
    const updatedBooking = await bookingLogic.updateBooking(
      id,
      userId,
      placeId,
      visitDate,
      status
    );
    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to cancel a booking
router.delete("/cancelBooking/:id", checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    await bookingLogic.cancelBooking(id);
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
