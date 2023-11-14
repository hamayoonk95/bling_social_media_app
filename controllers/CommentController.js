const Comment = require("../models/Comment");

const CommentController = {
    addComment: async (req, res) => {
        try {
            const { content } = req.body;
            const postId = req.params.postId;
            if (!req.user) {
                req.flash("error", "You need to be logged in to comment");
                return res.redirect("/users/login");
            }

            if (!content) {
                req.flash("error", "Comment content is required");
                return res.redirect("back");
            }

            const newComment = new Comment({
                content: content,
                author: req.user.id,
                post: postId,
            });

            await newComment.save();

            req.flash("success", "Comment added successfully");
            res.redirect("back");
        } catch (err) {
            console.error("Error while adding comment: ", err);
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }
    },
};

module.exports = CommentController;
