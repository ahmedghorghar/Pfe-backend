// backend/route/profile_route.js


const express = require("express");
const router = express.Router();
const { updateProfileImage } = require("../logic/Profile");
const checkToken = require("../middleware/checkToken");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const email = req.params.email.replace("@", "_").replace(".", "_"); // Replace special characters in email
    cb(null, email + ".jpg"); // Use email as the filename
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // Allow files up to 10 MB
  },
});

router.patch("/add/image/:email", checkToken, upload.single("img"), updateProfileImage);

module.exports = router;
