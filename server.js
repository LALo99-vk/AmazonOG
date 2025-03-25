const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define a schema for storing location data
const locationSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model("Location", locationSchema,'locations');

// Serve static files from 'public'
app.use(express.static("public"));

// Middleware for JSON data
app.use(express.json());

// API to save location data to MongoDB
app.post("/location", async (req, res) => {
  const { latitude, longitude } = req.body;
  const newLocation = new Location({ latitude, longitude });

  try {
    await newLocation.save();
    console.log("Location Saved to Database");
    res.json({ message: "Location saved successfully!" });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ message: "Failed to save location." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
