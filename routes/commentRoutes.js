const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

router.post("/:postId/new", CommentController.addComment);
// router.delete("/comments/:commentId", CommentController.deleteComment);

module.exports = router;
