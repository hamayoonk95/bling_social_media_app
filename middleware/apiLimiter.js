const rateLimit = require("express-rate-limit");

// Rate limiter configuration for API requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // limit each IP to 100 requests per windowMs
    message:
        "Too many requests from this IP, please try again after 15 minutes",
});

module.exports = apiLimiter;
