const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Middleware to protect routes and authenticate users based on JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the "Bearer <token>" format
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode the payload using the secret key
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID in the decoded token and exclude the password field
      req.user = await User.findById(decode.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (Error) {
      // If token verification fails, respond with a 401 status and error message
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    // If no token is provided, respond with a 401 status and error message
    res.status(401);
    throw new Error("No token provided, authorization denied");
  }
});

module.exports = { protect };
