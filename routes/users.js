const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const UserFollower = require("../models/UserFollower");
const authenticate = require("../middleware/authenticate");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/registered", async (req, res) => {
    const { firstname, surname, email, username, password } = req.body;

    // validation checks
    if (!firstname || !surname || !email || !username || !password) {
        req.flash("error", "All fields are required");
        return res.redirect("/users/register");
    }

    if (password.length < 8) {
        req.flash("error", "Password should be at least 8 characters long");
        return res.redirect("/users/register");
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        req.flash("error", "Username or Email already exists");
        return res.redirect("/users/register");
    }

    try {
        const user = new User({
            firstname,
            surname,
            email,
            username,
            password,
        });

        await user.save();
        req.flash("success", "Registered successfully. Please log in.");
        res.redirect("/users/login");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/users/register");
    }
});

router.get("/login", (err, res) => {
    res.render("users/login");
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.flash("error", "Both username and password are required");
        return res.redirect("/users/login");
    }

    const user = await User.findOne({ username });

    if (!user) {
        req.flash("error", "Invalid username or password");
        return res.redirect("/users/login");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        req.flash("error", "Invalid username or password");
        return res.redirect("/users/login");
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        "Secretkey",
        { expiresIn: "1h" }
    );

    req.flash("success", "User logged In successfully");
    res.cookie("authToken", token).redirect("/");
});

router.get("/profile", async (req, res) => {
    try {
        // Fetch user's posts, followers, and followings
        const userPosts = await Post.find({ author: req.user.id })
            .sort("-date")
            .populate({
                path: "likes",
                model: "Like",
            });
        const userFollowers = await UserFollower.find({
            following: req.user.id,
        }).populate("user");
        const userFollowings = await UserFollower.find({
            user: req.user.id,
        }).populate("following");

        // Map the data to get a list of users
        const followersList = userFollowers.map((follower) => follower.user);
        const followingsList = userFollowings.map(
            (following) => following.following
        );
        res.render("users/profile", {
            profileUser: req.user,
            user: req.user || {},
            posts: userPosts,
            followers: followersList,
            followings: followingsList,
            isSelf: true,
        });
    } catch (err) {
        console.error("Error fetching profile data:", err);
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
});

router.get("/logout", (req, res) => {
    req.flash("success", "Logged out Successfully");
    res.clearCookie("authToken").redirect("/");
});

router.get("/:userId/profile", async (req, res) => {
    const profileUserId = req.params.userId;
    try {
        const profileUser = await User.findById(profileUserId);
        if (!profileUser) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        const userPosts = await Post.find({ author: profileUserId })
            .sort("-date")
            .populate({
                path: "likes",
                model: "Like",
            });
        const userFollowers = await UserFollower.find({
            following: profileUserId,
        }).populate("user");
        const userFollowings = await UserFollower.find({
            user: profileUserId,
        }).populate("following");

        const followersList = userFollowers.map((follower) => follower.user);
        const followingsList = userFollowings.map(
            (following) => following.following
        );

        const isSelf = req.user && req.user.id.toString() === profileUserId;
        const isFollowing = req.user
            ? await UserFollower.findOne({
                  user: req.user.id,
                  following: profileUserId,
              })
            : false;

        res.render("users/profile", {
            profileUser: profileUser,
            user: req.user || {},
            posts: userPosts,
            followers: followersList,
            followings: followingsList,
            isFollowing: !!isFollowing,
            isSelf: isSelf,
        });
    } catch (err) {
        console.error("Error fetching user profile data:", err);
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
});

router.post("/follow/:userId", authenticate, async (req, res) => {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    try {
        const newFollow = new UserFollower({
            following: targetUserId,
            user: currentUserId,
        });

        await newFollow.save();
        req.flash("success", "User followed Successfully");
        res.redirect(`/users/${targetUserId}/profile`);
    } catch (error) {
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
});

router.post("/unfollow/:userId", authenticate, async (req, res) => {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    try {
        const unfollow = await UserFollower.findOneAndDelete({
            following: targetUserId,
            user: currentUserId,
        });

        if (unfollow) {
            req.flash("success", "User unfollowed successfully");
        } else {
            req.flash("error", "You are not following this user");
        }
        res.redirect(`/users/${targetUserId}/profile`);
    } catch (error) {
        console.error("Error unfollowing user:", error);
        req.flash("error", "Something went wrong");
        res.redirect(`/users/${targetUserId}/profile`);
    }
});

module.exports = router;
