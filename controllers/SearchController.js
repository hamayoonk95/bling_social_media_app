const Post = require("../models/Post");
const User = require("../models/User");

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
                searchResult = await Post.find({
                    content: { $regex: query, $options: "i" },
                }).populate("author");
            } else {
                req.flash("error", "Invalid Search Type");
                res.redirect("back");
            }
            console.log(searchResult);
            res.render("search/searchResults", {
                results: searchResult,
                searchType: type,
                query: query
            });
        } catch (error) {
            console.error(error);
            req.flash("error", "Something went wrong during the search");
            res.redirect("back");
        }
    },
};

module.exports = SearchController;
