const express = require("express");
const router = express.Router();
const NewsController = require("../controllers/NewsController");

router.get("/getHeadlines", NewsController.getHeadlines);
router.get("/searchNews", NewsController.searchNews);

module.exports = router;
