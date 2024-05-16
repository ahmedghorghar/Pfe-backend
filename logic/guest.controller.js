const express = require('express');
const Guest = require('../models/guestModel')

exports.GenerateGuest = async (req, res) => {
    try {
      // Generate a unique guest ID
      const guestID = generateGuestID();
      
      // Create a new guest document
      const guest = new Guest({
        guestID: guestID,
      });
  
      // Save the guest document to the database
      await guest.save();
  
      res.status(201).json({ guestID: guestID });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to generate guest ID' });
    }
  };

  
  exports.GuestCounter = async (req, res) => {
      try {
      // Call the function to count the guests
      const count = await countGuests();
      res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



 // Function to count the guests
 async function countGuests() {
   try {
     // Use the Guest model to query the database and count the documents
     const count = await Guest.countDocuments();
     return count;
   } catch (error) {
     throw error;
   }
 }


 // Function to generate a unique guest ID
function generateGuestID() {
    // Generate a random alphanumeric string as the guest ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const guestIDLength = 10;
    let guestID = '';
  
    for (let i = 0; i < guestIDLength; i++) {
      guestID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return guestID;
  }
  
