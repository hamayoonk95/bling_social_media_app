// ==================
// IMPORTS
// ==================
// Importing Mongoose Models
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

// validationResult, extracts validation errors from a request
const { validationResult } = require("express-validator");
// Validation middleware
const { createPostValidationRules } = require("../middleware/validationRules");

// ==================
// POST CONTROLLER
// ==================
const PostContoller = {
    // Fetches and displays all posts
    getPosts: async (req, res) => {
        try {
            // Fetch posts and populate author data
            const posts = await Post.find().populate("author").sort("-date");
            // Include likes and comments count, and user's like status
            const postRelatedData = await await Promise.all(
                posts.map(async (post) => {
                    const likesCount = await Like.countDocuments({
                        post: post._id,
                    });
                    const commentsCount = await Comment.countDocuments({
                        post: post._id,
                    });
                    const userHasLiked = req.user
                        ? await Like.exists({
                              post: post._id,
                              user: req.user.id,
                          })
                        : false;
                    return {
                        ...post._doc,
                        likesCount,
                        commentsCount,
                        userHasLiked,
                    };
                })
            );
            res.render("home", { user: req.user, posts: postRelatedData });
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.redirect("/");
        }
    },

    // Handles post creation
    createPost: [
        // apply validation rules
        ...createPostValidationRules(),

        async (req, res) => {
            try {
                // if User not found in request, then render login page
                if (!req.user) {
                    req.flash(
                        "error",
                        "You need to be logged in to create a post"
                    );
                    return res.redirect("/accounts/login-page");
                }

                // Validate input fields
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    errors
                        .array()
                        .forEach((error) => req.flash("error", error.msg));
                    return res.redirect("/");
                }
                // sanitize inputs
                req.sanitize(req.body.content);
                // Create and save the new post
                const { content } = req.body;
                const newPost = new Post({
                    content: content,
                    author: req.user.id,
                });
                await newPost.save();

                req.flash("success", "Post has been added successfully");
                res.redirect("/");
            } catch (err) {
                console.error("Error while adding post: ", err);
                res.redirect("/");
            }
        },
    ],

    // Fetches and displays a single post by ID
    getPostById: async (req, res) => {
        try {
            // Fetch Post
            const post = await Post.findById(req.params.postId).populate(
                "author"
            );
            // Fetch associated comments and likes
            const comments = await Comment.find({
                post: req.params.postId,
            }).populate("author");
            const commentsCount = await Comment.countDocuments({
                post: req.params.postId,
            });
            const likesCount = await Like.countDocuments({
                post: post._id,
            });
            const userHasLiked = req.user
                ? await Like.exists({ post: post._id, user: req.user.id })
                : false;

            // Combine post data with likes and comments
            const postWithRelatedData = {
                ...post._doc,
                likesCount,
                comments,
                commentsCount,
                userHasLiked,
            };
            res.render("post/postPage", { post: postWithRelatedData });
        } catch (err) {
            console.error("Error: ", err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
    },

    // Deletes a specific post by ID
    deletePost: async (req, res) => {
        try {
            // Fetch the post
            const post = await Post.findById(req.params.postId).populate(
                "author"
            );
            // If logged In user is not the same as post auther then throw error
            if (post.author.id.toString() !== req.user.id.toString()) {
                req.flash(
                    "error",
                    "You are not authorised to delete this post."
                );
                return res.redirect("/");
            }

            // Delete the post and its associated comments and likes
            await Comment.deleteMany({ post: req.params.postId });
            await Like.deleteMany({ post: req.params.postId });
            await Post.deleteOne(post._id);

            req.flash("success", "Post deleted successfully");
            res.redirect("/");
        } catch (err) {
            console.error("Error deleting post: ", err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
    },

    // Handles liking or unliking a post
    likePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            // Check if user is logged in
            let userId;
            if (req.user) {
                userId = req.user.id;
            } else {
                req.flash("error", "You need to be logged in to like a post");
                return res.redirect("/accounts/login-page");
            }

            // Check for existing likes
            const existingLike = await Like.findOne({
                post: postId,
                user: userId,
            });

            if (existingLike) {
                // If already liked, remove the like
                await Like.findByIdAndRemove(existingLike._id);
                req.flash("success", "Unliked the post!");
            } else {
                // If not liked, add a new like
                const newLike = new Like({ post: postId, user: userId });
                await newLike.save();
                req.flash("success", "Liked the post!");
            }
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            console.error(error);
            req.flash("error", "Something went wrong when liking the post");
            res.redirect(`/posts/${postId}`);
        }
    },
};

module.exports = PostContoller;
