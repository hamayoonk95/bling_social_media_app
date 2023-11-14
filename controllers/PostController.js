const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

const PostContoller = {
    getPosts: async (req, res) => {
        try {
            const posts = await Post.find().populate("author").sort("-date");
            const postWithLikes = await await Promise.all(
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
            res.render("index", { user: req.user, posts: postWithLikes });
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.redirect("/");
        }
    },

    createPost: async (req, res) => {
        try {
            if (!req.user) {
                req.flash("error", "You need to be logged in to create a post");
                return res.redirect("/users/login");
            }

            const { content } = req.body;
            if (!content) {
                req.flash("error", "Post content is required");
                res.redirect("/");
            }

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

    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId).populate(
                "author"
            );
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

            const postWithLikesAndComments = {
                ...post._doc,
                likesCount,
                comments,
                commentsCount,
                userHasLiked,
            };
            res.render("post/postPage", { post: postWithLikesAndComments });
        } catch (err) {
            console.error("Error: ", err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId).populate(
                "author"
            );
            if (post.author.id.toString() !== req.user.id.toString()) {
                req.flash(
                    "error",
                    "You are not authorised to delete this post."
                );
                return res.redirect("/");
            }
            await post.deleteOne({ id: post.id });
            req.flash("success", "Post deleted successfully");
            res.redirect("/");
        } catch (err) {
            console.error("Error deleting post: ", err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
    },

    likePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            let userId;
            if (req.user) {
                userId = req.user.id;
            } else {
                req.flash("error", "You need to be logged in to like a post");
                return res.redirect("/users/login");
            }

            const existingLike = await Like.findOne({
                post: postId,
                user: userId,
            });

            if (existingLike) {
                // User has already liked the post, so unlike it.
                await Like.findByIdAndRemove(existingLike._id);
                req.flash("success", "Unliked the post!");
            } else {
                // User has not liked the post, so add a new like.
                const newLike = new Like({ post: postId, user: userId });
                await newLike.save();
                req.flash("success", "Liked the post!");
            }
            res.redirect("back");
        } catch (error) {
            console.error(error);
            req.flash("error", "Something went wrong when liking the post");
            res.redirect("back");
        }
    },
};

module.exports = PostContoller;
