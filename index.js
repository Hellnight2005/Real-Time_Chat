// Import necessary modules
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const morgan = require("morgan");

const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const { notFound, ErrorHandler } = require("./middleware/errorMiddleware.js");

// Connect to the database
connectDB();

const app = express();
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Parse JSON bodies

// Default route
app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

// Config endpoint to expose Cloudinary settings

// User routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Middleware for handling 404 and errors
app.use(notFound);
app.use(ErrorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
