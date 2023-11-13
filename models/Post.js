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
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Like",
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Post", PostSchema);
