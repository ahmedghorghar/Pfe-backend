const nodemailer = require("nodemailer");
const AUTH = require("../../../models/AuthModel");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mrabetlassade@gmail.com",
    pass: "yagd cxwc kyrh vgqa",
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: "mrabetlassade@gmail.com",
      to: to,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
    sendEmail
}