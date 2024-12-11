const asyncHandler = require("express-async-handler");
const Message = require("../models/messagemodel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { json } = require("express");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data pass into request");
    return res.sendStatus(404);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(200).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

const allMessage = asyncHandler(async (req, res) => {
  try {
    // Fetch messages associated with a specific chat ID
    const messages = await Message.find({ chat: req.params.chatId })
      .populate(
        "sender", // Populate sender details (user data)
        "name pic email" // Select only name, pic, and email fields for the sender
      )
      .populate("chat"); // Populate chat details for the messages

    // Send the populated messages as JSON response
    res.json(messages);
  } catch (error) {
    // Handle errors and send an error response
    res
      .status(500)
      .json({ message: "Failed to retrieve messages", error: error.message });
  }
});

module.exports = {
  sendMessage,
  allMessage,
};
