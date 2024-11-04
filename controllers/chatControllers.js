const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Middleware to access or create a one-on-one chat between the logged-in user and another user
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Check if `userId` is provided in the request body
  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(405); // Send a 405 status if `userId` is missing
  }

  // Check if a one-on-one chat already exists between the logged-in user and the specified `userId`
  var isChat = await Chat.find({
    isGroupchat: false, // Ensure it's a one-on-one chat
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // Logged-in user is part of the chat
      { users: { $elemMatch: { $eq: userId } } }, // Other user is also part of the chat
    ],
  })
    .populate("users", "-password") // Populate `users` field, excluding password
    .populate("latestMessage"); // Populate `latestMessage` field for the latest message in the chat

  // Populate sender details in the latest message with specific fields (name, pic, email)
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // If a chat already exists, return the first matching chat
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // If no existing chat is found, create a new one-on-one chat
    var chatData = {
      chatName: "Sender", // Default name for one-on-one chat
      isGroupchat: false, // Indicate it's not a group chat
      users: [req.user._id, userId], // Include logged-in user and other user as chat members
    };

    try {
      // Create the new chat with `chatData`
      const createChat = await Chat.create(chatData);

      // Fetch the full details of the created chat, including populated user info
      const Fullchat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      // Send the newly created chat as the response
      res.status(200).send(Fullchat);
    } catch (Error) {
      // Handle errors if chat creation fails
      res.status(406);
      throw new Error(Error.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        result = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(407);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChat,
};
