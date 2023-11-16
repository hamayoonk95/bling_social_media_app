// ==================
// IMPORTS
// ==================
// Express framework import for routing
const express = require("express");
// Router instance from Express
const router = express.Router();
// Import user controller to handle news page related actions
const NewsController = require("../controllers/NewsController");

// ==================
// ROUTES
// ==================
// Route for displaying latest headlines
router.get("/getHeadlines", NewsController.getHeadlines);
// Route for searching for a specific news
router.get("/searchNews", NewsController.searchNews);

module.exports = router;
