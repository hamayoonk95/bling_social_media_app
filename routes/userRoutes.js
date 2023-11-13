const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const authenticate = require("../middleware/authenticate");

router.get("/register", userController.showRegistrationForm);
router.post("/registered", userController.registerUser);
router.get("/login", userController.showLoginForm);
router.post("/login", userController.loginUser);
router.get("/profile", authenticate, userController.showUserProfile);
router.get("/:userId/profile", userController.showOtherUserProfile);
router.get("/logout", authenticate, userController.logoutUser);
router.post("/follow/:userId", authenticate, userController.followUser);
router.post("/unfollow/:userId", authenticate, userController.unfollowUser);

module.exports = router;
