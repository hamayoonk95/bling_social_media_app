// ==================
// IMPORTS
// ==================
// Importing Mongoose Models
const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const UserFollower = require("../models/UserFollower");

// Bcrypt library for password hashing
const bcrypt = require("bcrypt");
// jsonwebtoken library for authentication
const jwt = require("jsonwebtoken");
// validationResult, extracts validation errors from a request
const { validationResult } = require("express-validator");
// Validation middleware
const {
    registerValidationRules,
    loginValidationRules,
} = require("../middleware/validationRules");

// ==================
// USER CONTROLLER
// ==================
const UserContoller = {
    // Returns register static page
    showRegistrationForm: (req, res) => {
        res.render("users/register");
    },

    // Handles user registration
    registerUser: [
        // apply validation rules
        ...registerValidationRules(),

        // Process the registration request
        async (req, res) => {
            // Validate input fields
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors
                    .array()
                    .forEach((error) => req.flash("error", error.msg));
                return res.redirect("/accounts/register-page");
            }
            // Extract user data from request body
            const { firstname, surname, email, username, password } = req.body;
            
            try {
                // Check for existing user with the same username or email
                const existingUser = await User.findOne({
                    $or: [{ username }, { email }],
                });
                if (existingUser) {
                    req.flash("error", "Username or Email already exists");
                    return res.redirect("/accounts/register-page");
                }
                // Create and save the new user
                const user = new User({
                    firstname,
                    surname,
                    email,
                    username,
                    password,
                });
                await user.save();

                req.flash("success", "Registered successfully. Please log in.");
                res.redirect("/accounts/login-page");
            } catch (err) {
                console.error(err);
                req.flash("error", "Something went wrong");
                res.redirect("/accounts/register-page");
            }
        },
    ],

    // Renders the user login form
    showLoginForm: (req, res) => {
        res.render("users/login");
    },

    // Processes user login
    loginUser: [
        // Apply validation rules
        ...loginValidationRules(),

        // Handle the login request
        async (req, res) => {
            // Validate input fields
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors
                    .array()
                    .forEach((error) => req.flash("error", error.msg));
                return res.redirect("/accounts/login-page");
            }
            const { username, password } = req.body;

            // Authenticate user using JWT
            const user = await User.findOne({ username });
            if (!user) {
                req.flash("error", "Invalid username or password");
                return res.redirect("/accounts/login-page");
            }
            // hashPassword and compare against stored password in database
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                req.flash("error", "Invalid username or password");
                return res.redirect("/accounts/login-page");
            }

            // Issue jwt authentication token with 1 hour expiration
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            req.flash("success", "User logged In successfully");
            res.cookie("authToken", token).redirect("/");
        },
    ],

    // Handles user logout
    logoutUser: (req, res) => {
        req.flash("success", "Logged out Successfully");
        res.clearCookie("authToken").redirect("/");
    },

    // Displays the profile of the logged-in user
    showUserProfile: async (req, res) => {
        try {
            // Fetch user posts and associated data such as likesCount, comments on posts
            const allUserPosts = await Post.find({ author: req.user.id })
                .populate("author")
                .sort("-date");
            const userPosts = await Promise.all(
                allUserPosts.map(async (post) => {
                    const postObject = post.toObject();
                    postObject.commentsCount = await Comment.countDocuments({
                        post: post._id,
                    });
                    postObject.likesCount = await Like.countDocuments({
                        post: post._id,
                    });
                    postObject.userHasLiked = req.user
                        ? await Like.exists({
                              post: post._id,
                              user: req.user.id,
                          })
                        : false;
                    return postObject;
                })
            );
            // Fetch followers and followings of the user
            const userFollowers = await UserFollower.find({
                following: req.user.id,
            }).populate("user");
            const userFollowings = await UserFollower.find({
                user: req.user.id,
            }).populate("following");

            // Prepare followers and followings list for rendering
            const followersList = userFollowers.map(
                (follower) => follower.user
            );
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
    },

    // Displays the profile of another user
    showOtherUserProfile: async (req, res) => {
        const profileUserId = req.params.userId;
        try {
            // Find the user by ID
            const profileUser = await User.findById(profileUserId);
            if (!profileUser) {
                req.flash("error", "User not found");
                return res.redirect("/");
            }

            // Fetch user posts and associated data such as likesCount, comments on posts
            const allUserPosts = await Post.find({
                author: profileUserId,
            })
                .populate("author")
                .sort("-date");
            const userPosts = await Promise.all(
                allUserPosts.map(async (post) => {
                    const postObject = post.toObject();
                    postObject.commentsCount = await Comment.countDocuments({
                        post: post._id,
                    });
                    postObject.likesCount = await Like.countDocuments({
                        post: post._id,
                    });
                    postObject.userHasLiked = req.user
                        ? await Like.exists({
                              post: post._id,
                              user: req.user.id,
                          })
                        : false;
                    if (postObject.author) {
                        postObject.author.username =
                            postObject.author.username.charAt(0).toUpperCase() +
                            postObject.author.username.slice(1);
                    }
                    return postObject;
                })
            );

            // Fetch followers and followings of the user
            const userFollowers = await UserFollower.find({
                following: profileUserId,
            }).populate("user");
            const userFollowings = await UserFollower.find({
                user: profileUserId,
            }).populate("following");

            // Prepare followers and followings list for rendering
            const followersList = userFollowers.map(
                (follower) => follower.user
            );
            const followingsList = userFollowings.map(
                (following) => following.following
            );

            // Check if the current user is following the profile user
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
                isFollowing: !!isFollowing, // Convert to boolean
                isSelf: isSelf,
            });
        } catch (err) {
            console.error("Error fetching user profile data:", err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
    },

    // Handles following a user
    followUser: async (req, res) => {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.id;

        try {
            // Create and save a new follow relationship
            const newFollow = new UserFollower({
                following: targetUserId,
                user: currentUserId,
            });
            await newFollow.save();

            req.flash("success", "User followed Successfully");
            res.redirect(`/accounts/${targetUserId}/profile`);
        } catch (error) {
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
    },

    // Handles unfollowing a user
    unfollowUser: async (req, res) => {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.id;

        try {
            // Remove the follow relationship
            const unfollow = await UserFollower.findOneAndDelete({
                following: targetUserId,
                user: currentUserId,
            });

            if (unfollow) {
                req.flash("success", "User unfollowed successfully");
            } else {
                req.flash("error", "You are not following this user");
            }
            res.redirect(`/accounts/${targetUserId}/profile`);
        } catch (error) {
            console.error("Error unfollowing user:", error);
            req.flash("error", "Something went wrong");
            res.redirect(`/accounts/${targetUserId}/profile`);
        }
    },
};

module.exports = UserContoller;
