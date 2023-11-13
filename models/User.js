const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    likesGiven: [
        {
            type: Schema.Types.ObjectId,
            ref: "Like",
        },
    ],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(error);
    }
});

module.exports = mongoose.model("User", userSchema);
