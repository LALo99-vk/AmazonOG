const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Middleware for JSON data
app.use(express.json());

// API endpoint to receive location data
app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;
  const timestamp = new Date().toISOString();

  console.log(`Location Received: Latitude: ${latitude}, Longitude: ${longitude}`);
  
  // Save location data to a file
  const logData = `${timestamp} - Latitude: ${latitude}, Longitude: ${longitude}\n`;
  fs.appendFileSync("location_log.txt", logData);

  res.json({ message: "Location saved successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
