// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  res.send({ message: "File uploaded successfully", file: req.file });
});

app.get("/download/:path", (req, res) => {
  const filePath = `uploads/${req.params.path}`;
  const absolutePath = path.resolve(__dirname, filePath);

  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({ error: "File not found" });
    }
    res.download(absolutePath, (err) => {
      if (err) {
        return res.status(500).send({ error: "Error downloading file" });
      }
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`File server is running on port ${PORT}`);
});
