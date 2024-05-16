// backend/logic/bookingLogic.js

const Booking = require('../models/booking');

// Function to create a new booking
async function createBooking(userId, placeId, agencyId,  visitDate) {
  try {
    const booking = new Booking({ userId, placeId, agencyId,  visitDate });
    console.log('userId:', userId)
    console.log('placeId:', placeId)
    console.log('visitDate:', visitDate)
    console.log('agencyId:', agencyId)
    await booking.save();
    return booking;
  } catch (error) {
    throw error;
  }
}

// Function to get all bookings for a user
async function getAgencyBookings(agencyId) {
  try {
    const bookings = await Booking.find({ agencyId });
    console.log('booking:', bookings);
    return bookings;
  } catch (error) {
    throw error;
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
};
