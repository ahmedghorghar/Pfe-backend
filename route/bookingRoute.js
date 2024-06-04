// backend/route/bookingRoute.js

const express = require("express");
const router = express.Router();
const bookingLogic = require("../logic/bookingLogic");
const { validateCreateBooking } = require("../validation/bookingValidation");
const checkToken = require("../middleware/checkToken");
const Booking = require("../models/booking");


// Route to create a new booking
router.post("/createBooking", checkToken, validateCreateBooking, async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { placeId, agencyId, visitDate, placeName, img, title, price, userName, userEmail } = req.body;

    const existingBooking = await Booking.findOne({
      userId,
      visitDate: {
        $gte: new Date(new Date(visitDate).setUTCHours(0, 0, 0, 0)),
        $lt: new Date(new Date(visitDate).setUTCHours(23, 59, 59, 999)),
      },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "User already has a booking for this date" });
    }

    const booking = await bookingLogic.createBooking(userId, placeId, agencyId, visitDate, placeName, img, title, price, userName, userEmail);
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: booking._id,
      placeId: booking.placeId,
      visitDate: booking.visitDate,
      userName: booking.userName,
      userEmail: booking.userEmail,
      userImage: booking.img,
      placeName: booking.placeName,
      placeTitle: booking.title,
      placePrice: booking.price,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



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
