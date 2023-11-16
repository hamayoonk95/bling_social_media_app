// ==================
// IMPORTS
// ==================
// Express framework import for routing
const express = require("express");
// Router instance from Express
const router = express.Router();
// Import user controller to handle post-related actions
const postController = require("../controllers/PostController");
// Middleware for authentication to protect certain routes
const authenticate = require("../middleware/authenticate");

// ==================
// ROUTES
// ==================
// Route for displaying all Posts
router.get("/", postController.getPosts);

// Route for creating a new post
router.post("/posts/new", authenticate, postController.createPost);

// Route for displaying a post by ID
router.get("/posts/:postId", postController.getPostById);

// Route for deleting a post
router.delete("/posts/:postId", authenticate, postController.deletePost);

// Route for adding a like on a post
router.post("/posts/:postId/like", authenticate, postController.likePost);

module.exports = router;
