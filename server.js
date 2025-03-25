const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static("public"));
app.use(express.json());

// Email setup using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// API endpoint to receive location data and send an email
app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;
  const timestamp = new Date().toISOString();

  console.log(`Location Received: Latitude: ${latitude}, Longitude: ${longitude}`);

  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: "Location Data Received",
    text: `Location Received at ${timestamp}\nLatitude: ${latitude}\nLongitude: ${longitude}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email." });
    }
    console.log("Email sent:", info.response);
    res.json({ message: "Location sent to email!" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
