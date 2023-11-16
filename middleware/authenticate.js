const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.cookies && req.cookies.authToken;

    if (token) {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
        } catch (err) {
            console.error("Invalid token", err);
        }
    }
    next();
};

module.exports = authenticate;
