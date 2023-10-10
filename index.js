const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.port || 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set("views", __dirname + "/views");

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");
// ejs mate library to create reuseable boilerplate code
app.engine("ejs", ejsMate);

// Tell Express to user method-override to override http-method header in the request
app.use(methodOverride("_method"));

app.engine("html", ejs.renderFile);

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log("Listenting on port");
});
