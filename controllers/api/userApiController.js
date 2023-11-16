const mongoose = require("mongoose");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const UserFollower = require("../../models/UserFollower");

const userApiController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const id = req.params.userId;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid User ID" });
            }
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserFollowers: async (req, res) => {
        try {
            const userId = req.params.userId;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid User ID" });
            }
            const followers = await UserFollower.find({
                following: userId,
            })
                .populate("user")
                .select("-following");

            const followerDetails = followers.map((follower) => {
                return {
                    id: follower.user._id,
                    username: follower.user.username,
                    firstname: follower.user.firstname,
                    surname: follower.user.surname,
                    email: follower.user.email,
                };
            });
            res.json(followerDetails);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserFollowings: async (req, res) => {
        try {
            const userId = req.params.userId;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid User ID" });
            }

            const followings = await UserFollower.find({
                user: userId,
            }).populate("following", "firstname surname username email");

            const followingDetails = followings.map((following) => {
                return {
                    id: following.following._id,
                    firstname: following.following.firstname,
                    surname: following.following.surname,
                    username: following.following.username,
                    email: following.following.email,
                };
            });

            res.json(followingDetails);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllCommentsForAUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const comments = await Comment.find({ author: userId });
            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = userApiController;
