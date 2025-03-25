const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Schema for location data
const locationSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model("Location", locationSchema);

// Middleware
app.use(express.static("public"));
app.use(express.json());

// API Endpoint to receive and store location data
app.post("/location", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Invalid location data" });
  }

  const newLocation = new Location({ latitude, longitude });

  try {
    await newLocation.save();
    console.log("Location saved to database:", newLocation);
    res.json({ message: "Location saved successfully!" });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ message: "Failed to save location." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
