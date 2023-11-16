// ==================
// IMPORTS
// ==================
// Express framework import for routing
const express = require("express");
// Router instance from Express
const router = express.Router();
// Import user controller to handle search-related actions
const SearchController = require("../controllers/SearchController");

// ==================
// ROUTES
// ==================
// Route for displaying the search page
router.get("/search_page", SearchController.showSearchPage);
// Router for getting search results
router.get("/new_search", SearchController.search);

module.exports = router;
