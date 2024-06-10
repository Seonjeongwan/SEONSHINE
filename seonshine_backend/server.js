// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import route handlers
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const commonRoutes = require("./routes/commonRoutes");
//const orderRoutes = require("./routes/orderRoutes");

// Import database initialization function
const initializeDb = require("./db/initialize");

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5050;

// Use CORS middleware
app.use(cors());

// Use bodyParser middleware for JSON
app.use(bodyParser.json());

// Define route handlers
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/common", commonRoutes);
// app.use("/order", orderRoutes);

// Initialize the database
async function startServer() {
  try {
    // Initialize the database connections
    await initializeDb();

    // Start the server on the specified port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing databases:", error);
    setTimeout(startServer, 5000); // Retry after 5 seconds if initialization fails
  }
}

// Start the server
startServer();

//test for docker test
