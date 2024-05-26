// backend/routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const placeController = require('../logic/uploadController');
const chekToken = require('../middleware/checkToken');


// Protected routes for agencies
router.post('/add-places', chekToken,  placeController.createPlace);
router.patch('/update/:id', chekToken, placeController.updatePlaceById);
router.delete('/delete/:id', chekToken, placeController.deletePlaceById);

// Public routes accessible to all users
router.get('/get-places/:agencyId', chekToken, placeController.getAllPlaces);
router.get('/places/:id', placeController.getPlaceById);
router.get('/all-places', placeController.getAllPlacesPublic); // Add this line


module.exports = router;
