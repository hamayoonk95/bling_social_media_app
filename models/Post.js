const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defines the structure for posts
const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the writer of the post
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to handle cascading delete of comments and likes when a post is deleted
PostSchema.pre("deleteOne", { document: true, query: false }, function (next) {
    const postId = this._id;

    this.model("Comment").deleteMany({ post: postId }, (err) => {
        if (err) {
            return next(err);
        }
        this.model("Like").deleteMany({ post: postId }, next);
    });
});

module.exports = mongoose.model("Post", PostSchema);
