const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Represents a 'like' on a post by a user
const LikeSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post", // Reference to the post that is liked
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the user who liked the post
        required: true,
    },
});

module.exports = mongoose.model("Like", LikeSchema);
