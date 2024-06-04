// logic/passwordResetLogic.js

const AuthModel = require("../models/AuthModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = async (userId, type) => {
  const secretKey = type === "user" ? process.env.JWT_SECRET_USER : process.env.JWT_SECRET_AGENCY;
  const token = jwt.sign({ userId, type }, secretKey, { expiresIn: "15m" });
  const newToken = new Token({ userId, token });
  await newToken.save();
  return token;
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

class Passwordreset {
  async sendVerificationCode(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({ status: 401, message: "Enter Your Email" });
    }

    try {
      const user = await AuthModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ status: 401, message: "Invalid user" });
      }

      const verificationCode = generateVerificationCode();
      user.verificationCode = verificationCode;
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Code de vérification pour réinitialisation du mot de passe",
        text: `Votre code de vérification est :${verificationCode}`,
        html: `<p>Votre code de vérification est :<strong>${verificationCode}</strong></p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
      });

      res.status(201).json({
        status: 201,
        message: "Code de vérification envoyé avec succès",
      });
    } catch (error) {
      console.error("Error sending verification code:", error);
      res.status(401).json({ status: 401, message: "Invalid user or server error" });
    }
  }
  
  async verifyResetCode(req, res) {
    try {
      const { email, verificationCode } = req.body;

      if (!email || !verificationCode) {
        return res.status(400).json({
          status: 400,
          message: "Email and verification code are required",
        });
      }

      const user = await AuthModel.findOne({ email, verificationCode });

      if (user) {
        res.status(200).json({ status: 200, message: "Verification successful" });
      } else {
        res.status(401).json({ status: 401, message: "Invalid verification code" });
      }
    } catch (error) {
      console.error("Error verifying reset code:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }

  async changePassword(req, res) {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }
  
    try {
      const user = await AuthModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Log the user details before updating the password
      console.log("User found for password change:", user);
  
      const saltRounds = Number(process.env.BCRYPT_SALT);
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      // Log the hashed password before saving
      console.log("Hashed Password:", hashedPassword);
  
      user.password = hashedPassword;
      await user.save();
  
      // Log the user details after updating the password
      console.log("User after password change:", user);
  
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
      };
      const secretKey = user.type === "user" ? process.env.JWT_SECRET_USER : process.env.JWT_SECRET_AGENCY;
      const token = jwt.sign(payload, secretKey);
  
      res.status(200).json({
        message: "Password changed successfully",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
        }
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async handleUserRequest(req, res) {
    const { type } = req.params;

    try {
      switch (type) {
        case "sendVerificationCode":
          await this.sendVerificationCode(req, res);
          break;
        case "verifyResetCode":
          await this.verifyResetCode(req, res);
          break;
        case "changePassword":
          await this.changePassword(req, res);
          break;
        default:
          res.status(400).json({ status: 400, message: "Invalid request type" });
          break;
      }
    } catch (error) {
      console.error("Error handling user request:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
}

module.exports = Passwordreset;
