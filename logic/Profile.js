// backend/logic/Profile.js

const AuthModel = require("../model/AuthModel");


const updateProfileImage = async (req, res) => {
  try {
    const email = req.params.email; // Get email from request parameters

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
      message: "Image added successfully updated",
      data: updatedUser,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updateProfileImage };
