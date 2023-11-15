const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const UserFollower = require("./models/UserFollower");
const Like = require("./models/Like");
const Comment = require("./models/Comment");

const bcrypt = require("bcrypt");

// Hash passwords for users
async function hashUserPasswords(users) {
    return Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
        })
    );
}

const {
    users,
    posts,
    userFollowers,
    likes,
    comments,
} = require("./populateDB_dummyData");

async function populateDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/blingDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        // Populate Users
        const hashedPasswordUser = await hashUserPasswords(users);
        await User.insertMany(hashedPasswordUser);
        console.log("Users inserted");

        // Populate Posts
        await Post.insertMany(posts);
        console.log("Posts inserted");

        // Populate User Followers
        await UserFollower.insertMany(userFollowers);
        console.log("User Followers inserted");

        // Populate Likes
        await Like.insertMany(likes);
        console.log("Likes inserted");

        // Populate Comments
        await Comment.insertMany(comments);
        console.log("Comments inserted");
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
}

populateDatabase();
