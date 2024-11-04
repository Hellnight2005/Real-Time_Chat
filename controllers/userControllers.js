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
  // Check if a search query is provided in the request
  // If a search query exists, create a filter object using MongoDB's $regex operator for case-insensitive partial matching
  // The filter will match either the `name` or `email` fields based on the search query
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; // If no search query, use an empty filter to retrieve all users

  // Query the database to find users matching the filter criteria
  // Also exclude the current logged-in user from the results by filtering with `_id: { $ne: req.user._id }`
  const user = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  // Send the list of users as the response
  res.send(user);
});

module.exports = {
  registerUser,
  allUser,
  authUser,
};
