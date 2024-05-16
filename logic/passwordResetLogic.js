// logic/passwordResetLogic.js

const AuthModel = require("../models/AuthModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token handling
const Token = require("../models/token.model"); // Assuming model is in parent directory

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mrabetlassade@gmail.com",
    pass: "yagd cxwc kyrh vgqa",
  },
});

const generateToken = async (userId, type) => {
  const secretKey =
    type === "user"
      ? process.env.JWT_SECRET_USER
      : process.env.JWT_SECRET_AGENCY;
  const token = jwt.sign({ userId, type }, secretKey, { expiresIn: "15m" });
  const newToken = new Token({ userId, token });
  await newToken.save();
  return token;
};

// Importez une fonction pour générer un code aléatoire
const generateVerificationCode = () => {
  // Generate a random 6-digit verification code
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
      console.log("User found:", user); // Add this line for debugging

      if (!user) {
        return res.status(401).json({ status: 401, message: "Invalid user" });
      }
      // Générez un code de vérification
      const verificationCode = generateVerificationCode();

      // Enregistrez le code de vérification dans la base de données
      user.verificationCode = verificationCode;
      await user.save();

      // Options du courrier électronique
      const mailOptions = {
        from: "mrabetlassade@gmail.com",
        to: email,
        subject: "Code de vérification pour réinitialisation du mot de passe",
        text: `Votre code de vérification est :${verificationCode}`,
        html: `<p>Votre code de vérification est :<strong>${verificationCode}</strong></p>`,
      };
      /* , */
      // Utilisez votre transporter nodemailer ici
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
      });

      res.status(201).json({
        status: 201,
        message: "code de  Verification envoyer avec succée",
      });
    } catch (error) {
      console.error("Error sending verification code:", error);
      res
        .status(401)
        .json({ status: 401, message: "Invalid user or server error" });
    }
  }
  async verifyResetCode(req, res) {
    try {
      const { email, verificationCode } = req.body;
      console.log("Verification code received:", verificationCode); // Add this line for debugging

      if (!email || !verificationCode) {
        return res
          .status(400) /* ;
        return res
          .status(400) */
          .json({
            status: 400,
            message: "Email and verification code are required",
          });
      }

      const user = await AuthModel.findOne({ email, verificationCode }); // Find user by email and verification code

      if (user) {
        // Verification successful
        res
          .status(200)
          .json({ status: 200, message: "Verification successful" });
      } else {
        // Verification failed
        res
          .status(401)
          .json({ status: 401, message: "Invalid verification code" });
      }
    } catch (error) {
      console.error("Error verifying reset code:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
  async changePassword(req, res, email,/*  token, oldPassword, */ newPassword, type) {
    try {
      const user = await AuthModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ status: 401, message: "Invalid user" });
      }
  
      user.password = newPassword;
      user.verificationCode = null;
      await user.save();
  
      // Re-authenticate the user with the new credentials (optional)
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error(
            "Error re-authenticating user after password change:",
            loginErr
          );
          return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
        }
  
        console.log("Password changed successfully");
        // Return the updated user object
        res
          .status(200)
          .json({ status: 200, message: "Password changed successfully", userType: type });
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
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
          res
            .status(400)
            .json({ status: 400, message: "Invalid request type" });
          break;
      }
    } catch (error) {
      console.error("Error handling user request:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
}
module.exports = Passwordreset;
