// backend/logic/uploadController.js

const Place = require("../models/upload-model");
const Auth = require("../models/AuthModel");


// Create a new place
const createPlace = async (req, res) => {
  try {
    // Extract required fields
    const {
        title,
        placeName,
        StartEndPoint,
        photos,
        visitDate,
        price,
        description,
        duration,
        HotelName,
        CheckInOut,
        accessibility,
        phoneNumber
    } = req.body;

    // Check if all required fields are present
    if (
      !title || 
      !placeName ||
      !StartEndPoint ||
      !photos ||
      !visitDate ||
      !price ||
      !description ||
      !duration ||
      !phoneNumber
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Find the agency ID from the logged-in user
    const { id: agencyId } = req.decoded;

    // Create new Place object
    const place = new Place({
      title,
      placeName,
      StartEndPoint,
      photos,
      visitDate,
      price,
      description,
      duration,
      HotelName,
      CheckInOut,
      accessibility,
      phoneNumber, // Ensure phoneNumber is included
      agencyId,
    });

    // Save the place to the database
    await place.save();
    res.status(201).send(place);
  } catch (error) {
    if (error.message.includes("_id")) {
      res.status(400).json({ message: "Authorization error: Could not identify logged-in agency." });
    } else {
      res.status(400).json({ message: error.message || "Bad Request" });
    }
  }
}

// Get all places
const getAllPlaces = async (req, res) => {
  try {
    // Extract the agency ID from the request parameters or query string
    const { agencyId } = req.params; // Assuming agencyId is in the route parameters

    // Find all places associated with the specified agency ID
    const places = await Place.find({ agencyId });

    // Check if any places were found
    if (!places || places.length === 0) {
      return res.status(404).json({ message: "No places found for the specified agency" });
    }

    // Return the places found
    res.status(200).json(places);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching places by agency ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific place by ID
const getPlaceById = async (req, res) => {
  try {
    // Find the agency ID from the decoded token
    const { id: agencyId } = req.decoded;

    // Find all places associated with the agency ID
    const places = await Place.find({ agencyId });
    res.send(places);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Update a place by ID
const updatePlaceById = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "title",
      "placeName",
      "StartEndPoint",
      "photos",
      "visitDate",
      "price",
      "description",
      "duration",
      "HotelName",
      "CheckInOut",
      "accessibility",
      "phoneNumber",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      return res.status(404).send();
    }

    res.send(place);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a place by ID
const deletePlaceById = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).send();
    }
    res.send(place);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Get all places (public)
const getAllPlacesPublic = async (req, res) => {
  try {
    // Fetch all places without filtering by agencyId
    const places = await Place.find();

    // Check if any places were found
    if (!places || places.length === 0) {
      return res.status(404).json({ message: "No places found" });
    }

    // Return the places found
    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlaceById,
  deletePlaceById,
  getAllPlacesPublic, // Add this line
};
