const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authenticate = require("../middleware/authenticate");

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("author").sort("-date");
        res.render("index", { user: req.user, posts: posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.redirect("/");
    }
});

router.post("/posts/new", authenticate, async (req, res) => {
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
});

router.delete("/posts/:postId", authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("author");
        if (post.author.id.toString() !== req.user.id.toString()) {
            req.flash("error", "You are not authorised to delete this post.");
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
});

module.exports = router;
