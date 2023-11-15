const express = require("express");
const router = express.Router();
const postApiController = require("../../controllers/api/postApiController");

router.get("/posts/", postApiController.getAllPosts);
router.get("/posts/:Id", postApiController.getPostById);
router.get("/posts/user/:userId", postApiController.getPostByUser);
router.get("/posts/date-range", postApiController.getPostsByDateRange);

module.exports = router;
