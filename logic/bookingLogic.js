  // backend/logic/bookingLogic.js
  const Booking = require("../models/booking");
  const Auth = require('../models/AuthModel'); // Adjust the path as necessary
  const Place = require('../models/upload-model'); // Ensure the Place model is also imported correctly

  // Function to create a new booking
  async function createBooking(userId, placeId, agencyId, visitDate) {
    try {
      const booking = new Booking({ userId, placeId, agencyId, visitDate });
      await booking.save();
      return booking;
    } catch (error) {
      throw new Error(`Error creating booking: ${error.message}`);
    }
  }
// Function to get all bookings for an agency
async function getAgencyBookings(agencyId) {
  try {
    const bookings = await Booking.find({ agencyId })
      .populate({
        path: 'userId',
        model: 'AUTH', // Ensure this matches the model name in your schema
        select: 'name email' // Select only the necessary fields
      })
      .populate({
        path: 'placeId',
        model: 'Place', // Ensure this matches the model name in your schema
        select: 'title placeName price', // Select only the necessary fields
      })
      .exec();

    // Transform the bookings to the desired format
    const formattedBookings = [];
    bookings.forEach(booking => {
      const formattedBooking = {
        _id: booking._id,
        userId: {
          _id: booking.userId._id,
          email: booking.userId.email,
          name: booking.userId.name,
        },
        placeId: {
          _id: booking.placeId._id,
          title: booking.placeId.title,
          placeName: booking.placeId.placeName,
          price: booking.placeId.price,
        },
        agencyId: booking.agencyId,
        visitDate: booking.visitDate,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        __v: booking.__v,
      };
      formattedBookings.push(formattedBooking);
    });

    return formattedBookings;
  } catch (error) {
    console.error("Error fetching agency bookings:", error);
    throw error;
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
