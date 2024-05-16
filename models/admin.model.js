// backend/models/admin.model.js

const mongoose = require("mongoose");
/* const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({ path: 'admin.env' });
const bcryptSalt = process.env.BCRYPT_SALT;

 */
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: { 
    type: String, 
    unique: true 
}, 
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
