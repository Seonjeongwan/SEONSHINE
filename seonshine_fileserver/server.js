// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Route to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  res.send({ message: "File uploaded successfully", file: req.file });
});

// Start the server
app.listen(PORT, () => {
  console.log(`File server is running on port ${PORT}`);
});
