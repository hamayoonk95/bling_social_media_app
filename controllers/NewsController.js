// ==================
// IMPORTS
// ==================
// import request library for making HTTPS requests
const request = require("request");

// API endpoint base URL
const NEWS_API_URL = "https://newsapi.org/v2/";

// ==================
// NEWS CONTROLLER
// ==================
const NewsController = {
    // Fetches and displays top news headlines
    getHeadlines: async (req, res) => {
        // Construct URL for top headlines
        const url = `${NEWS_API_URL}top-headlines?country=gb&apiKey=${process.env.NEWS_API_KEY}`;

        // Request options including headers
        const options = {
            url: url,
            json: true,
            headers: {
                "User-Agent": "Bling App",
            },
        };

        // Make an API request
        request(options, (error, response, body) => {
            if (error) {
                console.error("Error fetching data", error);
                return res.status(500).send("Error fetching data");
            }

            // Check for a successful response and render the news
            if (response.statusCode == 200 && body.status === "ok") {
                res.render("news/news", {
                    title: "Latest Headlines",
                    news: body.articles,
                });
            } else {
                req.flash("error", "Failed to fetch data");
                return res.status(response.statusCode).redirect("/");
            }
        });
    },

    // Searches and displays news based on a query
    searchNews: async (req, res) => {
        // Extract search query from request
        const query = req.query.q;
        // Construct URL for searching news articles
        const url = `${NEWS_API_URL}everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`;

        // Request options including headers
        const options = {
            url: url,
            json: true,
            headers: {
                "User-Agent": "Bling App",
            },
        };

        // Make an API request
        request(options, (error, response, body) => {
            if (error) {
                console.error("Error fetching data", error);
                return res.status(500).send("Error fetching data");
            }

            // Check for a successful response and render the news
            if (response.statusCode == 200 && body.status === "ok") {
                res.render("news/news", {
                    title: `Headlines for '${query}'`,
                    news: body.articles,
                });
            } else {
                req.flash("error", "Failed to fetch data");
                return res.status(response.statusCode).redirect("/");
            }
        });
    },
};

module.exports = NewsController;
