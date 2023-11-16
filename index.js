// Framework and Utilities
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// Templating
const ejs = require("ejs");
const ejsMate = require("ejs-mate");

// Database
const mongoose = require("mongoose");

// Authentication and Sessions
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const authenticate = require("./middleware/authenticate");

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const searchRoutes = require("./routes/searchRoutes");

//API Routes
const postApiRoutes = require("./routes/api/postApiRoutes");
const userApiRoutes = require("./routes/api/userApiRoutes");

const app = express();
const PORT = process.env.port || 3000;

// ==================
// MONGOOSE SETUP
// ==================
mongoose
    .connect("mongodb://127.0.0.1:27017/blingDB", {
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

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.use("/users", userRoutes);
app.use("/", postRoutes);
app.use("/comments", commentRoutes);
app.use("/search", searchRoutes);

app.use("/api", postApiRoutes);
app.use("/api", userApiRoutes);

// Start Server
app.listen(PORT, () => {
    console.log("Listenting on port");
});
