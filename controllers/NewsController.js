const request = require("request");

const NEWS_API_URL = "https://newsapi.org/v2/";

const NewsController = {
    getHeadlines: async (req, res) => {
        const url = `${NEWS_API_URL}top-headlines?country=gb&apiKey=${process.env.NEWS_API_KEY}`;

        const options = {
            url: url,
            json: true,
            headers: {
                "User-Agent": "Bling App",
            },
        };

        request(options, (error, response, body) => {
            if (error) {
                console.error("Error fetching data", error);
                return res.status(500).send("Error fetching data");
            }
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

    searchNews: async (req, res) => {
        const query = req.query.q;
        const url = `${NEWS_API_URL}everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`;

        const options = {
            url: url,
            json: true,
            headers: {
                "User-Agent": "Bling App",
            },
        };

        request(options, (error, response, body) => {
            if (error) {
                console.error("Error fetching data", error);
                return res.status(500).send("Error fetching data");
            }
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
