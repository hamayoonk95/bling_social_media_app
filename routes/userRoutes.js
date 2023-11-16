// ==================
// IMPORTS
// ==================
// Express framework import for routing
const express = require("express");
// Router instance from Express
const router = express.Router();
// Import user controller to handle user-related actions
const userController = require("../controllers/UserController");
// Middleware for authentication to protect certain routes
const authenticate = require("../middleware/authenticate");

// ==================
// ROUTES
// ==================
// Route for displaying the registration form
router.get("/registerUser", userController.showRegistrationForm);

// Route for handling the registration form submission
router.post("/registered", userController.registerUser);

// Route for displaying the login form
router.get("/getLogin", userController.showLoginForm);

// Route for handling the login form submission
router.post("/loginUser", userController.loginUser);

// Route for displaying the user's profile
router.get("/profile", authenticate, userController.showUserProfile);

// Route for displaying other user's profile
router.get("/:userId/profile", userController.showOtherUserProfile);

// Route for logging out the user
router.get("/userLogout", authenticate, userController.logoutUser);

// Route for following another user
router.post("/follow/:userId", authenticate, userController.followUser);

// Route for unfollowing a user
router.post("/unfollow/:userId", authenticate, userController.unfollowUser);

module.exports = router;
