const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    media: {
        url: String,
        type: {
            type: String,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

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
