const { body, query } = require("express-validator");

// Registration validation rules
const registerValidationRules = () => [
    body("firstname", "First name is required").notEmpty().trim().escape(),
    body("surname", "Surname is required").notEmpty().trim().escape(),
    body("email", "Invalid email address").isEmail().normalizeEmail(),
    body("username", "Username is required").notEmpty().trim().escape(),
    body("password", "Password must be at least 8 characters long").isLength({
        min: 8,
    }),
];

// Login validation rules
const loginValidationRules = () => [
    body("username", "Username is required").notEmpty().trim().escape(),
    body("password", "Password is required").notEmpty(),
];

// Post creation validation rules
const createPostValidationRules = () => [
    body("content", "Post content is required").notEmpty().trim().escape(),
];

// Comment addition validation rules
const addCommentValidationRules = () => [
    body("content", "Comment content is required").notEmpty().trim().escape(),
];

// Search validation rules
const searchValidationRules = () => [
    query("query", "Search query is required").notEmpty().trim().escape(),
    query("type", "Search type is invalid").isIn(["users", "posts"]),
];

module.exports = {
    registerValidationRules,
    loginValidationRules,
    createPostValidationRules,
    addCommentValidationRules,
    searchValidationRules,
};
