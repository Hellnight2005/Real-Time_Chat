const express = require("express");
const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userControllers");

const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Define the POST route for user registration
router.post("/", registerUser);
router.get("/", protect, allUser);
router.post("/login", authUser);

module.exports = router;
