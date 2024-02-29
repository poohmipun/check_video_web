const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000; // Or any other port you want to use

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route handler for handling POST requests to /send-data
app.post('/send-data', (req, res) => {
  const { videoName } = req.body;

  // Process the video name here (e.g., look for files)

  // For demonstration purposes, let's just log the video name and send it back as the response
  console.log('Received video name:', videoName);
  res.json({ message: 'Video name received', videoName });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
