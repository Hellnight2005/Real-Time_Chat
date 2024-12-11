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
    // Find chats involving the logged-in user
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password") // Populate user details without password
      .populate("groupAdmin", "-password") // Populate groupAdmin details without password
      .populate("latestMessage") // Populate latest message in the chat
      .sort({ updatedAt: -1 }); // Sort by updatedAt, most recent first

    // Populate sender information for the latest message
    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email", // Select fields for the sender
    });

    // Send the populated chat data in the response
    res.status(200).json(populatedResults);
  } catch (error) {
    // Respond with a 500 status code for internal server errors
    res.status(500).json({ message: error.message });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(408).send({ message: "lease fill all the field" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(409)
      .send("more then 2 user are required to form a group");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupchat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(410);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(411);
    throw new Error("Chat Not Found ");
  } else {
    res.json(updatedChat);
  }
});

const addFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(412);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!remove) {
    res.status(412);
    throw new Error("Chat Not Found");
  } else {
    res.json(remove);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addFromGroup,
  removeFromGroup,
};
