const express = require("express");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const userRoutes = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");

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
app.use(
    session({
        secret: "yourSecretHere",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ==================
// ROUTES
// ==================
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.use("/users", userRoutes);

// Start Server
app.listen(PORT, () => {
    console.log("Listenting on port");
});
