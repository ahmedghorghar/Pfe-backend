// backend/route/bookingRoute.js

const express = require("express");
const router = express.Router();
const bookingLogic = require("../logic/bookingLogic");
const { validateCreateBooking } = require("../validation/bookingValidation");
const checkToken = require("../middleware/checkToken");
const Booking = require('../models/booking')
// Route to create a new booking
router.post(
  "/createBooking",
  checkToken,
  validateCreateBooking,
  async (req, res) => {
    try {
        const userId = req.decoded.id; // Assuming user ID is stored in the request object after authentication
        const { placeId, visitDate, agencyId } = req.body;

        // Check if the user already has a booking for the specified date
      const existingBooking = await Booking.findOne({ userId, visitDate });

      if (existingBooking) {
        return res.status(400).json({ message: "User already has a booking for this date" });
      }
        
       
      // Find the user by their ID
  
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
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
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Route to get all bookings for a user

router.get("/getAgencyBookings", checkToken, async (req, res) => {
  try {
    const agencyId = req.decoded.id;  // Assuming user ID is stored in the request object after authentication
    const bookings = await bookingLogic.getAgencyBookings(agencyId);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
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
