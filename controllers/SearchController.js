const Post = require("../models/Post");
const User = require("../models/User");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

const SearchController = {
    showSearchPage: async (req, res) => {
        res.render("search/searchResults");
    },

    search: async (req, res) => {
        try {
            const query = req.query.query;
            const type = req.query.type;

            if (!query) {
                req.flash("error", "Search query is required");
                return res.redirect("back");
            }

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
                        postObject.commentsCount = await Comment.countDocuments(
                            { post: post._id }
                        );

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
};

module.exports = SearchController;
