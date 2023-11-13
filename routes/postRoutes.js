const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");
const authenticate = require("../middleware/authenticate");

router.get("/", postController.getPosts);
router.post("/posts/new", authenticate, postController.createPost);
router.get("/posts/:postId", postController.getPostById);
router.delete("/posts/:postId", authenticate, postController.deletePost);
router.post("/posts/:postId/like", authenticate, postController.likePost);

module.exports = router;
