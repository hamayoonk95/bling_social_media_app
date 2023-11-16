const Comment = require("../models/Comment");
const { addCommentValidationRules } = require("../middleware/validationRules");
const { validationResult } = require("express-validator");

const CommentController = {
    addComment: [
        addCommentValidationRules(),

        async (req, res) => {
            // Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", errors.array()[0].msg);
                return res.redirect("back");
            }

            try {
                const { content } = req.body;
                const postId = req.params.postId;
                if (!req.user) {
                    req.flash("error", "You need to be logged in to comment");
                    return res.redirect("/users/login");
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
    ],
};

module.exports = CommentController;
