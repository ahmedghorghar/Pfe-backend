// logic/admin/admin.Password.ResetLogic.js

const Admin = require("../../../models/admin.model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config({ path: 'admin.env' });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'mrabetlassade@gmail.com',
    pass: 'yagd cxwc kyrh vgqa',
  },
});

class AdminPasswordReset {
  async sendVerificationCode(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const verificationCode = generateVerificationCode();

      // Store the verification code in the database
      admin.verificationCode = verificationCode;
      await admin.save();

      const mailOptions = {
        from: 'mrabetlassade@gmail.com',
        to: email,
        subject: "Verification Code for Password Reset",
        text: `Your verification code is: ${verificationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send verification code" });
        }
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Verification code sent successfully" });
      });
    } catch (error) {
      console.error("Error sending verification code:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyResetCode(req, res) {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    try {
      const admin = await Admin.findOne({ email, verificationCode });
      if (!admin) {
        return res.status(401).json({ message: "Invalid verification code" });
      }

      // Verification successful
      res.status(200).json({ message: "Verification successful" });
    } catch (error) {
      console.error("Error verifying reset code:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async changePassword(req, res) {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      await admin.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

function generateVerificationCode() {
  // Generate a random 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = AdminPasswordReset;
