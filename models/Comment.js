const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defines the structure for comments
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the user who wrote the comment
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post", // Reference to the post the comment is associated with
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the date when the comment is created
    },
});

module.exports = mongoose.model("Comment", commentSchema);
