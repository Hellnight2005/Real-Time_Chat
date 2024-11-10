const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { emit } = require("nodemon");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(401);
    throw new Error("Please enter all the fields");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(402);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(403);
    throw new Error("Failed to create a user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid  user");
  }
});
// /api/user/?search
const allUser = asyncHandler(async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let keyword = {};

    if (searchQuery) {
      // Use a regex pattern that matches only the start or full match of name or email
      keyword = {
        $or: [
          { name: { $regex: `^${searchQuery}`, $options: "i" } }, // Start with query
          { email: { $regex: `^${searchQuery}`, $options: "i" } }, // Start with query
        ],
      };
    }

    // Exclude the logged-in user
    const userFilter = { _id: { $ne: req.user?._id } };

    // Query the database with the combined filter
    const users = await User.find({ ...keyword, ...userFilter });

    // Send the filtered list of users as the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
});

module.exports = {
  registerUser,
  allUser,
  authUser,
};
