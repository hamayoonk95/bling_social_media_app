const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const users = [
    {
        _id: new ObjectId(),
        firstname: "john",
        surname: "doe",
        username: "john_doe",
        email: "john_doe@example.com",
        password: "Database321",
    },
    {
        _id: new ObjectId(),
        firstname: "jane",
        surname: "smith",
        username: "jane",
        email: "jane_smith@example.com",
        password: "Goldsmiths_11",
    },
    {
        _id: new ObjectId(),
        firstname: "Sam",
        surname: "Khan",
        username: "sam",
        email: "sam@example.com",
        password: "Password@321",
    },
];

const posts = [
    {
        _id: new ObjectId(),
        content:
            "Exploring the hidden waterfalls of the Amazon! 🌿🌊 #Adventure #Travel",
        author: users[0]._id,
        createdAt: new Date(),
    },
    {
        _id: new ObjectId(),
        content: "Just finished baking my first sourdough bread. 🍞",
        author: users[1]._id,
        createdAt: new Date(),
    },
    {
        _id: new ObjectId(),
        content:
            "Just completed a 10k run in under 50 minutes! Feeling accomplished. 🏃‍♂️ #FitnessGoals",
        author: users[2]._id,
        createdAt: new Date(),
    },
];

const userFollowers = [
    {
        _id: new ObjectId(),
        user: users[0]._id,
        following: users[1]._id,
    },
    {
        _id: new ObjectId(),
        user: users[0]._id,
        following: users[2]._id,
    },
    {
        _id: new ObjectId(),
        user: users[1]._id,
        following: users[0]._id,
    },
    {
        _id: new ObjectId(),
        user: users[1]._id,
        following: users[2]._id,
    },
    {
        _id: new ObjectId(),
        user: users[2]._id,
        following: users[0]._id,
    },
    {
        _id: new ObjectId(),
        user: users[2]._id,
        following: users[1]._id,
    },
];

const likes = [
    {
        _id: new ObjectId(),
        post: posts[0]._id,
        user: users[1]._id,
    },
    {
        _id: new ObjectId(),
        post: posts[0]._id,
        user: users[2]._id,
    },
    {
        _id: new ObjectId(),
        post: posts[1]._id,
        user: users[0]._id,
    },
    {
        _id: new ObjectId(),
        post: posts[2]._id,
        user: users[0]._id,
    },
    {
        _id: new ObjectId(),
        post: posts[2]._id,
        user: users[1]._id,
    },
];

const comments = [
    {
        _id: new ObjectId(),
        content: "Wow, that looks amazing! Can't wait to see some photos!",
        post: posts[0]._id,
        author: users[1]._id,
        createdAt: new Date(),
    },
    {
        _id: new ObjectId(),
        content: "Been there last year, truly a breathtaking experience!",
        post: posts[0]._id,
        author: users[2]._id,
        createdAt: new Date(),
    },
    {
        _id: new ObjectId(),
        content: "It looks delicious! Care to share the recipe?",
        post: posts[1]._id,
        author: users[0]._id,
        createdAt: new Date(),
    },
    {
        _id: new ObjectId(),
        content: "Nothing beats the smell of fresh bread. Great job!",
        post: posts[1]._id,
        author: users[2]._id,
        createdAt: new Date(),
    },

    {
        _id: new ObjectId(),
        content: "That's an impressive time! Keep pushing your limits.",
        post: posts[2]._id,
        author: users[0]._id,
        createdAt: new Date(),
    },
    {
        _id: new ObjectId(),
        content: "You're inspiring me to lace up my running shoes right now!",
        post: posts[2]._id,
        author: users[1]._id,
        createdAt: new Date(),
    },
];

module.exports = {
    users,
    posts,
    userFollowers,
    likes,
    comments,
};
