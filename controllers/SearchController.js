const Post = require("../models/Post");
const User = require("../models/User");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const { validationResult } = require("express-validator");
const { searchValidationRules } = require("../middleware/validationRules");

const SearchController = {
    showSearchPage: async (req, res) => {
        res.render("search/searchResults");
    },

    search: [
        searchValidationRules(),
        async (req, res) => {
            // Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.flash("error", errors.array()[0].msg);
                return res.redirect("back");
            }
            try {
                const query = req.query.query;
                const type = req.query.type;

                let searchResult = [];
                if (type == "users") {
                    searchResult = await User.find({
                        username: { $regex: query, $options: "i" },
                    });
                } else if (type == "posts") {
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
                    res.redirect("back");
                }
                res.render("search/searchResults", {
                    results: searchResult,
                    searchType: type,
                    query: query,
                });
            } catch (error) {
                console.error(error);
                req.flash("error", "Something went wrong during the search");
                res.redirect("back");
            }
        },
    ],
};

module.exports = SearchController;
