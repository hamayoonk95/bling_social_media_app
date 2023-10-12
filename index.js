// Framework and Utilities
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// Templating
const ejs = require("ejs");
const ejsMate = require("ejs-mate");

// Database
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb"); // If you are using MongoDB directly without Mongoose

// Authentication and Sessions
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const authenticate = require("./middleware/authenticate");

// Routes
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.port || 3000;

// ==================
// MONGOOSE SETUP
// ==================
mongoose
    .connect("mongodb://127.0.0.1:27017/twitterdb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// ==================
// APP CONFIG
// ==================
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.engine("ejs", ejsMate);
app.engine("html", ejs.renderFile);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("Secretkey"));
app.use(
    session({
        secret: "yourSecretHere",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(flash());

app.use(authenticate);

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});

// ==================
// ROUTES
// ==================

app.get("/about", authenticate, (req, res) => {
    if (!req.user) {
        req.flash("error", "Please Login to Continue");
        return res.redirect("/users/login");
    }
    res.render("about.ejs");
});

app.use("/users", userRoutes);
app.use("/", postRoutes);

// Start Server
app.listen(PORT, () => {
    console.log("Listenting on port");
});
