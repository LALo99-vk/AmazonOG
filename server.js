const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Middleware for JSON data
app.use(express.json());

// API endpoint to receive location data
app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;
  const timestamp = new Date().toISOString();
  const logFilePath = path.join(__dirname, "location_log.txt");

  console.log(`Location Received: Latitude: ${latitude}, Longitude: ${longitude}`);
  
  // Save location data to a file
  const logData = `${timestamp} - Latitude: ${latitude}, Longitude: ${longitude}\n`;
  
  try {
    fs.appendFileSync(logFilePath, logData);
    res.json({ message: "Location saved successfully!" });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Failed to save location." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
