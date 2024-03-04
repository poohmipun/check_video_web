const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

let mainFolderPath = "./test_dataset"; // Store the main folder path

// Endpoint to set the main folder path
app.post("/set-main-folder", (req, res) => {
  const requestData = req.body;
  mainFolderPath = requestData.folderPath; // Set the main folder path
  console.log("Main folder path set:", mainFolderPath);
  res.status(200).json({ message: "Main folder path set successfully" });
});

// Endpoint to handle sending data
app.post("/send-data", (req, res) => {
  const requestData = req.body;
  const videoName = requestData.videoName.replace(".mp4", ""); // Remove the ".mp4" extension from the video name
  console.log("Received video name:", videoName);

  // Search for a folder with the same name as the video name in the main folder
  const subFolderName = videoName.split("-")[0];
  const folderPath = path.join(mainFolderPath, subFolderName, videoName);
  console.log("Constructed folder path:", folderPath);

  fs.access(folderPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error accessing folder:", err);
      res.status(404).json({ message: "Folder not found" });
      return;
    }

    // Read the contents of the folder
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error reading folder contents:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      // Construct URLs for each file
      const fileURLs = files.map((file) => {
        return `http://localhost:5000/${subFolderName}/${videoName}/${file}`;
      });

      // Send back the URLs to the frontend
      res.status(200).json({ message: "Files found", fileURLs });
      console.log("Constructed file URLs:", fileURLs);
    });
  });
});

// Serve static files
app.use(express.static(mainFolderPath));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
