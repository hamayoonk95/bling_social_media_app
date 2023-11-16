const { body, query } = require("express-validator");

const registerValidationRules = () => [
    body("firstname", "First name is required").notEmpty().trim().escape(),
    body("surname", "Surname is required").notEmpty().trim().escape(),
    body("email", "Invalid email address").isEmail().normalizeEmail(),
    body("username", "Username is required").notEmpty().trim().escape(),
    body("password", "Password must be at least 8 characters long").isLength({
        min: 8,
    }),
];

const loginValidationRules = () => [
    body("username", "Username is required").notEmpty().trim().escape(),
    body("password", "Password is required").notEmpty(),
];

const createPostValidationRules = () => [
    body("content", "Post content is required").notEmpty().trim().escape(),
];

const addCommentValidationRules = () => [
    body("content", "Comment content is required").notEmpty().trim().escape(),
];

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
