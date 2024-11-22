// Import necessary modules
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const morgan = require("morgan");

const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

// Connect to the database
connectDB();

const app = express();
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Parse JSON bodies

// Default route
app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

// User routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Middleware for handling 404 and errors
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let usersTyping = {};
// Initialize Socket.IO
const io = require("socket.io")(server, {
  pingTimeout: 60000, // Timeout setting for keeping the connection alive
  cors: {
    origin: "http://localhost:5173", // Adjust this to match your frontend origin
    credentials: true,
  },
});

// Setup Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected to Socket.IO");

  // Event for setting up the user’s socket room
  socket.on("setup", (userData) => {
    socket.join(userData.id); // Join room specific to the user’s ID
    socket.emit("connected");
  });

  // Event for joining a chat room
  socket.on("join Chat", (room) => {
    socket.join(room);
    console.log("User joined the room: " + room);
  });

  socket.on("typing", (chatId) => {
    // Emit to all users in the chat that someone is typing
    usersTyping[chatId] = socket.id;
    socket.broadcast.emit("typing", chatId);
  });

  socket.on("stop typing", (chatId) => {
    // Stop showing the typing indicator
    delete usersTyping[chatId];
    socket.broadcast.emit("stop typing", chatId);
  });

  // New message event
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    // Send the new message to all users except the sender
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.to(user._id).emit("message received", newMessageReceived);
    });
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected from Socket.IO");
  });
});
