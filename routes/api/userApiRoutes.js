// ==================
// IMPORTS
// ==================
// Express framework import for routing
const express = require("express");
// Router instance from Express
const router = express.Router();
// Import userapicontroller to handle userApi-related actions
const userApiController = require("../../controllers/api/userApiController");

// ==================
// ROUTES
// ==================
// Route for getting data about all users
router.get("/users/", userApiController.getAllUsers);

// Route for getting data about a specific users
router.get("/users/:userId", userApiController.getUserById);

// Route for getting followers of a specific user
router.get("/users/:userId/followers", userApiController.getUserFollowers);

// Route for getting followings of a specific user
router.get("/users/:userId/followings", userApiController.getUserFollowings);

// Route for getting all comments made by a specific user
router.get("/users/:userId/comments", userApiController.getAllCommentsForAUser);

module.exports = router;
