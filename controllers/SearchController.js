// ==================
// MODEL
// ==================

// Importing Mongoose Models
const Post = require("../models/Post");
const User = require("../models/User");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

// validationResult, extracts validation errors from a request
const { validationResult } = require("express-validator");
// Validation middleware
const { searchValidationRules } = require("../middleware/validationRules");

// ==================
// SEARCH CONTROLLER
// ==================
const SearchController = {
    // Renders the search page
    showSearchPage: async (req, res) => {
        res.render("search/searchResults");
    },

    // Handles the search functionality
    search: [
        // Apply search validation rules
        searchValidationRules(),
        async (req, res) => {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", errors.array()[0].msg);
                return res.redirect("/search/search_page");
            }
            try {
                // Extract search query and type
                const { query, type } = req.query;

                let searchResult = [];
                if (type == "users") {
                    // Search among users
                    searchResult = await User.find({
                        username: { $regex: query, $options: "i" },
                    });
                } else if (type == "posts") {
                    // Search among posts and populate related data
                    const posts = await Post.find({
                        content: { $regex: query, $options: "i" },
                    }).populate("author");
                    searchResult = await Promise.all(
                        posts.map(async (post) => {
                            const postObject = post.toObject();
                            postObject.likesCount = await Like.countDocuments({
                                post: post._id,
                            });
                            postObject.commentsCount =
                                await Comment.countDocuments({
                                    post: post._id,
                                });

                            return postObject;
                        })
                    );
                } else {
                    req.flash("error", "Invalid Search Type");
                    res.redirect("/search/search_page");
                }

                // Render the search results page
                res.render("search/searchResults", {
                    results: searchResult,
                    searchType: type,
                    query: query,
                });
            } catch (error) {
                console.error(error);
                req.flash("error", "Something went wrong during the search");
                res.redirect("/search/search_page");
            }
        },
    ],
};

module.exports = SearchController;
