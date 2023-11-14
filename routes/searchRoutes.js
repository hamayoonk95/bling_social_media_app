const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/SearchController");

router.get("/search_page", SearchController.showSearchPage);
router.get("/new_search", SearchController.search);

module.exports = router;
