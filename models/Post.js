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

PostSchema.pre("remove", function (next) {
    this.model("Comment").deleteMany({ post: this._id }, next);
});

module.exports = mongoose.model("Post", PostSchema);
