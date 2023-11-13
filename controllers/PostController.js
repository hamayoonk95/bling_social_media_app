const Post = require("../models/Post");
const Like = require("../models/Like");

const PostContoller = {
    getPosts: async (req, res) => {
        try {
            const posts = await Post.find()
                .populate("author")
                .sort("-date")
                .populate({
                    path: "likes",
                    model: "Like",
                });
            res.render("index", { user: req.user, posts: posts });
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
            const post = await Post.findById(req.params.postId)
                .populate("author")
                .populate({
                    path: "likes",
                    model: "Like",
                });
            res.render("postPage", { post: post });
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
                await Post.findByIdAndUpdate(postId, {
                    $pull: { likes: existingLike._id },
                });
                req.flash("success", "Unliked the post!");
            } else {
                // User has not liked the post, so add a new like.
                const newLike = new Like({ post: postId, user: userId });
                await newLike.save();
                await Post.findByIdAndUpdate(postId, {
                    $addToSet: { likes: newLike._id },
                });
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
