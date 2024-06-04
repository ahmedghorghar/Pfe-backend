// logic/admin/admin.controller.js


const AUTH = require('../../models/AuthModel')
const Admin = require('../../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: 'admin.env' });

// Controller function to generate unique login credentials for admin
exports.generateAdminCredentials = async (req, res) => {
  try {
    // Check if an admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin credentials already exist' });
    }

      const password = 'MrabetLassade'; // Temporary password
      const email = 'mbt.lass.dev@gmail.com';
      
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

    // Create a new admin with generated credentials
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET_ADMIN);
    return res.status(201).json({ email, password, token });
  } catch (error) {
    console.error('Error generating admin credentials:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Controller function to handle admin login
exports.adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email)
  
      // Find the admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET_ADMIN);
  
      // Password is correct, return success message and token
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error in admin login:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  /// Function to delete a user or agency
exports.deleteUserOrAgency = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user/agency exists
    const user = await AUTH.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User/Agency not found" });
    }

    // Delete the user/agency
    await AUTH.deleteOne({ _id: id });

    // Return success message
    res.status(200).json({ message: "User/Agency deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUserOrAgency:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};