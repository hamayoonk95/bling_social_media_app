const mongoose = require("mongoose");
const Post = require("../../models/Post");

const postApiController = {
    getPostById: async (req, res) => {
        try {
            const id = req.params.Id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid Post ID" });
            }
            const post = await Post.findOne(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            res.json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

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

    getPostsByDateRange: async (req, res) => {
        const { startDate, endDate } = req.query;
        try {
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
};

module.exports = postApiController;
