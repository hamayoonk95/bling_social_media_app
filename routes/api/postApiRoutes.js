// ==================
// IMPORTS
// ==================
// Express framework import for routing
const express = require("express");
// Router instance from Express
const router = express.Router();
// Import postApiController to handle postApi-related actions
const postApiController = require("../../controllers/api/postApiController");

// ==================
// ROUTES
// ==================
// Route for getting data of all posts
router.get("/posts/", postApiController.getAllPosts);

// Route for getting data of all posts between a specific date range
router.get("/posts/date-range", postApiController.getPostsByDateRange);

// Route for getting data of a specific posts
router.get("/posts/:Id", postApiController.getPostById);

// Route for getting data of all posts by a specific user
router.get("/posts/user/:userId", postApiController.getPostByUser);

// Route for getting data of all comments on a specific post
router.get("/posts/:postId/comments", postApiController.getAllCommentsForAPost);

module.exports = router;
