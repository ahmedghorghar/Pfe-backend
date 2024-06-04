// backend/route/profile_route.js


const express = require("express");
const router = express.Router();
const { updateProfileImage, updateAgencyProfile } = require("../logic/Profile");
const checkToken = require("../middleware/checkToken");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the uploads directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const email = req.params.email.replace("@", "_").replace(".", "_");
    cb(null, `${email}.jpg`); // Use email as the filename
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // Allow files up to 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
  }
});

router.patch("/add/image/:email", checkToken, upload.single("img"), updateProfileImage);
router.patch("/update/agency/:email", checkToken, updateAgencyProfile);

module.exports = router;
