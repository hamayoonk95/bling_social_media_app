// ==================
// ENVIRONMENT CONFIGURATION
// ==================
require("dotenv").config();

// ==================
// FRAMEWORK AND UTILITIES IMPORTS
// ==================
// Express framework for routing and middleware
const express = require("express");
// Body parser for parsing request bodies
const bodyParser = require("body-parser");
// Method override for supporting put/delete requests in forms
const methodOverride = require("method-override");
// Helmet for securing Express apps by setting various HTTP headers
const helmet = require("helmet");
const apiLimiter = require("./middleware/apiLimiter");

// ==================
// TEMPLATING ENGINE IMPORTS
// ==================
// EJS for templating
const ejs = require("ejs");
// EJS-Mate for layout support in EJS
const ejsMate = require("ejs-mate");

// ==================
// DATABASE IMPORT
// ==================
// Mongoose for MongoDB interactions
const mongoose = require("mongoose");

// ==================
// AUTHENTICATION AND SESSIONS IMPORTS
// ==================
// Express session for session management
const session = require("express-session");
// connect-flash for flash messages
const flash = require("connect-flash");
// Cookie parser for parsing cookies
const cookieParser = require("cookie-parser");
// Custom middleware for JWT authentication
const authenticate = require("./middleware/authenticate");

// ==================
// ROUTES IMPORTS
// ==================
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const searchRoutes = require("./routes/searchRoutes");

// ==================
// API ROUTES IMPORTS
// ==================
const postApiRoutes = require("./routes/api/postApiRoutes");
const userApiRoutes = require("./routes/api/userApiRoutes");

// ==================
// NEWS ROUTES IMPORT
// ==================
const newsRoutes = require("./routes/newsRoutes");

// ==================
// APP INITIALIZATION
// ==================
const app = express();
const PORT = process.env.PORT || 3001;

// ==================
// MONGOOSE SETUP
// ==================

// Connect to MongoDB using Mongoose
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// ==================
// EXPRESS APP CONFIG
// ==================
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Set EJS as the templating engine
app.engine("ejs", ejsMate);
app.engine("html", ejs.renderFile);

// Apply Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(helmet());
app.use(flash());
app.use(authenticate);

// Middleware to pass variables to all templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});

// ==================
// ROUTES SETUP
// ==================
// Basic route for 'about' page
app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// Apply routes to the application
app.use("/accounts", userRoutes);
app.use("/home", postRoutes);
app.use("/comments", commentRoutes);
app.use("/search", searchRoutes);
app.use("/news", newsRoutes);

// API routes for access to data
app.use("/api", apiLimiter, postApiRoutes);
app.use("/api", apiLimiter, userApiRoutes);

// ==================
// SERVER INITIALIZATION
// ==================
// Start the server
app.listen(PORT, () => {
    console.log("Listenting on port");
});
