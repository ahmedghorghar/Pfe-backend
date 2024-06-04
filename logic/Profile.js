// backend/logic/Profile.js

const AuthModel = require("../models/AuthModel");

const updateProfileImage = async (req, res) => {
  try {
    const email = req.params.email; // Get email from request parameters

    // Check if the file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedUser = await AuthModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = {
      message: "Image successfully updated",
      data: updatedUser,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateAgencyProfile = async (req, res) => {
  try {
    const email = req.params.email; // Get email from request parameters
    const { agencyName, location, description, phoneNumber } = req.body;

    // Create an object with only the fields that are present in the request body
    const updateFields = {};
    if (agencyName !== undefined) updateFields.agencyName = agencyName;
    if (location !== undefined) updateFields.location = location;
    if (description !== undefined) updateFields.description = description;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;

    // Find the user by email and ensure the type is 'agency', then update only the specified fields
    const updatedUser = await AuthModel.findOneAndUpdate(
      { email: email, type: 'agency' },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Agency not found or not authorized" });
    }

    const response = {
      message: "Profile successfully updated",
      data: updatedUser,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.error("Error updating agency profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { updateProfileImage, updateAgencyProfile };