const { body, query } = require("express-validator");

const registerValidationRules = () => [
    body("firstname").notEmpty().withMessage("First name is required"),
    body("surname").notEmpty().withMessage("Surname is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];

const loginValidationRules = () => [
    body("username", "Username is required").notEmpty(),
    body("password", "Password is required").notEmpty(),
];

const createPostValidationRules = () => [
    body("content", "Post content is required").notEmpty(),
];

const addCommentValidationRules = () => [
    body("content", "Comment content is required").notEmpty(),
];

const searchValidationRules = () => [
    query("query", "Search query is required").notEmpty(),
    query("type", "Search type is invalid").notEmpty(),
];

module.exports = {
    registerValidationRules,
    loginValidationRules,
    createPostValidationRules,
    addCommentValidationRules,
    searchValidationRules,
};
