  // backend/logic/bookingLogic.js
  const Booking = require("../models/booking");
  const Auth = require('../models/AuthModel'); // Adjust the path as necessary
  const Place = require('../models/upload-model'); // Ensure the Place model is also imported correctly

  async function createBooking(userId, placeId, agencyId, visitDate, placeName, img, title, price, userName, userEmail) {
    try {
      const place = await Place.findById(placeId);
      if (!place) {
        throw new Error("Place not found");
      }
  
      const user = await Auth.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
  
      const booking = new Booking({
        userId,
        placeId,
        agencyId,
        visitDate,
        img, // Directly use img from the request body
        placeName, // Directly use placeName from the request body
        title, // Directly use title from the request body
        price, // Directly use price from the request body
        userName, // Directly use userName from the request body
        userEmail, // Directly use userEmail from the request body
      });
  
      await booking.save();
      return booking;
    } catch (error) {
      throw new Error(`Error creating booking: ${error.message}`);
    }
  }
  
  // Function to get all bookings for an agency
  async function getAgencyBookings(agencyId) {
    try {
      const bookings = await Booking.find({ agencyId });
      return bookings;
    } catch (error) {
      throw new Error(`Error fetching user bookings: ${error.message}`);
    }
  }
  // Function to get all bookings for a user
  async function getUserBookings(userId) {
    try {
      const bookings = await Booking.find({ userId });
      return bookings;
    } catch (error) {
      throw new Error(`Error fetching user bookings: ${error.message}`);
    }
  }

  // Function to update a booking
  async function updateBooking(id, userId, placeId, visitDate, status) {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { userId, placeId, visitDate, status },
        { new: true }
      );
      return updatedBooking;
    } catch (error) {
      throw error;
    }
  }

  // Function to cancel a booking
  async function cancelBooking(id) {
    try {
      await Booking.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  module.exports = {
    createBooking,
    getAgencyBookings,
    updateBooking,
    cancelBooking,
    getUserBookings,
  };
