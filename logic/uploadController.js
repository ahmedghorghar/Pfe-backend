// backend/logic/uploadController.js

const Place = require("../models/upload-model");
const AUTH = require("../models/AuthModel"); // Ensure correct path and model name



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
    const { agencyId } = req.params;

    const places = await Place.find({ agencyId }).populate('agencyId', 'agencyName');

    if (!places || places.length === 0) {
      return res.status(404).json({ message: "No places found for the specified agency" });
    }

    const transformedPlaces = places.map(place => ({
      _id: place._id,
      agencyId: place.agencyId._id,
      agencyName: place.agencyId.agencyName,
      title: place.title,
      placeName: place.placeName,
      StartEndPoint: place.StartEndPoint,
      photos: place.photos,
      visitDate: place.visitDate,
      price: place.price,
      description: place.description,
      duration: place.duration,
      HotelName: place.HotelName,
      CheckInOut: place.CheckInOut,
      accessibility: place.accessibility,
      phoneNumber: place.phoneNumber,
      __v: place.__v
    }));

    res.status(200).json(transformedPlaces);
  } catch (error) {
    console.error("Error fetching places by agency ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Get a specific place by ID
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.status(200).json(place);
  } catch (error) {
    console.error('Error fetching place by ID:', error); // Log the error
    res.status(500).json({ message: 'Failed to fetch place', error: error.message });
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

const getAllPlacesPublic = async (req, res) => {
  try {
    // Fetch all places and populate agency details
    const places = await Place.find().populate('agencyId', 'agencyName'); // Populate only the 'name' field

    // Check if any places were found
    if (!places || places.length === 0) {
      return res.status(404).json({ message: "No places found" });
    }

    // Map through places to include agencyName
    const placesWithAgencyName = places.map(place => ({
      ...place.toObject(),
      agencyName: place.agencyId ? place.agencyId.agencyName : 'Unknown Agency',
    }));

    // Return the places with agencyName
    res.status(200).json(placesWithAgencyName);
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
