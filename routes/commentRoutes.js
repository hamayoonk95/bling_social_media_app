// ==================
// IMPORTS
// ==================
// Express framework import for routing
const express = require("express");
// Router instance from Express
const router = express.Router();
// Import user controller to handle comment-related actions
const CommentController = require("../controllers/CommentController");

// ==================
// ROUTES
// ==================
// Route for creating a comment on a post
router.post("/:postId/new", CommentController.addComment);

module.exports = router;
