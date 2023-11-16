// ==================
// IMPORTS
// ==================
// import mongoose library
const mongoose = require("mongoose");
const Post = require("../../models/Post");
// Importing Mongoose Models
const Comment = require("../../models/Comment");

// ==================
// POST API CONTROLLER
// ==================
const postApiController = {
    // Retrieves and sends a specific post by its ID
    getPostById: async (req, res) => {
        try {
            const id = req.params.Id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid Post ID" });
            }
            const post = await Post.findOne({ _id: id });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            res.json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Retrieves and sends all posts
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Retrieves and sends all posts by a specific user
    getPostByUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid User ID" });
            }
            const posts = await Post.find({ author: userId });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Retrieves and sends all posts between a date range
    getPostsByDateRange: async (req, res) => {
        const { startDate, endDate } = req.query;
        try {
            let start = new Date(startDate);
            let end = new Date(endDate);

            // If time is not specified, adjust the start and end to cover the full day
            if (!startDate.includes("T")) {
                start.setHours(0, 0, 0, 0); // Set start of day
            }
            if (!endDate.includes("T")) {
                end.setHours(23, 59, 59, 999); // Set end of day
            }
            const posts = await Post.find({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            }).sort({ createdAt: -1 });

            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Retrieves and sends all comments on a specific post
    getAllCommentsForAPost: async (req, res) => {
        try {
            const postId = req.params.postId;
            const comments = await Comment.find({ post: postId });
            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = postApiController;
