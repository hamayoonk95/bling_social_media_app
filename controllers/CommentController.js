// ==================
// IMPORTS
// ==================
// Importing Mongoose Models
const Comment = require("../models/Comment");
// Validation middleware
const { addCommentValidationRules } = require("../middleware/validationRules");
// validationResult, extracts validation errors from a request
const { validationResult } = require("express-validator");

// ==================
// COMMENT CONTROLLER
// ==================
const CommentController = {
    // Handles the addition of a new comment
    addComment: [
        // Apply comment validation rules
        addCommentValidationRules(),

        async (req, res) => {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", errors.array()[0].msg);
                return res.redirect(`/posts/${postId}`);
            }

            try {
                // Extract comment content from request body
                const { content } = req.body;
                // Extract the post ID to which the comment belongs
                const postId = req.params.postId;

                // Ensure the user is logged in before allowing comment addition
                if (!req.user) {
                    req.flash("error", "You need to be logged in to comment");
                    return res.redirect("/accounts/login-page");
                }

                // Create and save the new comment
                const newComment = new Comment({
                    content: content,
                    author: req.user.id,
                    post: postId,
                });
                await newComment.save();

                req.flash("success", "Comment added successfully");
                res.redirect(`/posts/${postId}`);
            } catch (err) {
                console.error("Error while adding comment: ", err);
                req.flash("error", "Something went wrong");
                res.redirect(`/posts/${postId}`);
            }
        },
    ],
};

module.exports = CommentController;
