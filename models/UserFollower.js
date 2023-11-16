const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Represents the following relationship between users
const userFollowerSchema = new Schema({
    following: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the user that is being followed
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the user who follows
        required: true,
    },
});

module.exports = mongoose.model("UserFollower", userFollowerSchema);
