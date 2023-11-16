const express = require("express");
const router = express.Router();
const userApiController = require("../../controllers/api/userApiController");

router.get("/users/", userApiController.getAllUsers);
router.get("/users/:userId", userApiController.getUserById);
router.get("/users/:userId/followers", userApiController.getUserFollowers);
router.get("/users/:userId/followings", userApiController.getUserFollowings);
router.get("/users/:userId/comments", userApiController.getAllCommentsForAUser);

module.exports = router;
