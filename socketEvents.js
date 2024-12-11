module.exports = (io) => {
  const userRooms = {}; // Store rooms for each user

  io.on("connection", (socket) => {
    console.log("User connected");

    // Handle 'setup' event
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      userRooms[userData._id] = socket.id; // Track the room for this user
      socket.emit("connected");
    });

    // Handle 'join chat' event
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Handle 'typing' event
    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    });

    // Handle 'stop typing' event
    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });

    // Handle 'new message' event
    socket.on("new message", (newMessageReceived) => {
      const chat = newMessageReceived.chat;

      if (!chat || !Array.isArray(chat.users)) {
        return console.log("Invalid chat structure or chat.users is missing");
      }

      // Broadcast to all users except the sender
      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return; // Skip sender

        socket.to(user._id).emit("message received", newMessageReceived); // Emit to specific user
      });
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("User disconnected");

      // Remove user from all rooms they were part of
      for (let room of Object.keys(userRooms)) {
        if (userRooms[room] === socket.id) {
          socket.leave(room);
        }
      }
    });
  });
};
