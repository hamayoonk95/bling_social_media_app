const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const UserFollower = require("../models/UserFollower");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserContoller = {
    showRegistrationForm: (req, res) => {
        res.render("users/register");
    },

    registerUser: async (req, res) => {
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
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
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
    },

    showLoginForm: (req, res) => {
        res.render("users/login");
    },

    loginUser: async (req, res) => {
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
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        req.flash("success", "User logged In successfully");
        res.cookie("authToken", token).redirect("/");
    },

    logoutUser: (req, res) => {
        req.flash("success", "Logged out Successfully");
        res.clearCookie("authToken").redirect("/");
    },

    showUserProfile: async (req, res) => {
        try {
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
            const userFollowers = await UserFollower.find({
                following: req.user.id,
            }).populate("user");
            const userFollowings = await UserFollower.find({
                user: req.user.id,
            }).populate("following");

            // Map the data to get a list of users
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

    showOtherUserProfile: async (req, res) => {
        const profileUserId = req.params.userId;
        try {
            const profileUser = await User.findById(profileUserId);
            if (!profileUser) {
                req.flash("error", "User not found");
                return res.redirect("/");
            }

            const allUserPosts = await Post.find({
                author: profileUserId,
            })
                .populate("author")
                .sort("-date"); // Ensure author data is populated
            const userPosts = await Promise.all(
                allUserPosts.map(async (post) => {
                    const postObject = post.toObject(); // Convert to a JavaScript object
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
                    // Capitalize the author's username
                    if (postObject.author) {
                        postObject.author.username =
                            postObject.author.username.charAt(0).toUpperCase() +
                            postObject.author.username.slice(1);
                    }
                    return postObject;
                })
            );

            const userFollowers = await UserFollower.find({
                following: profileUserId,
            }).populate("user");
            const userFollowings = await UserFollower.find({
                user: profileUserId,
            }).populate("following");

            const followersList = userFollowers.map(
                (follower) => follower.user
            );
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
                isFollowing: !!isFollowing, // Convert to boolean
                isSelf: isSelf,
            });
        } catch (err) {
            console.error("Error fetching user profile data:", err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
    },

    followUser: async (req, res) => {
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
    },

    unfollowUser: async (req, res) => {
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
    },
};

module.exports = UserContoller;
