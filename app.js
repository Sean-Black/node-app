const path = require("path");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000;

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile("server.log", log + "\n", err => {
    if (err) {
      console.log("unable to append to server .log");
    }
  });
  next();
});

hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

app.get("/", (req, res, next) => {
  res.render("home.hbs", {
    pageTitle: "Home Page"
  });
});

app.get("/about", (req, res, next) => {
  res.render("about.hbs", {
    pageTitle: "About Page"
  });
});

app.get("/projects", (req, res) => {
  res.render("projects.hbs", {
    pageTitle: "Projects"
  });
});

app.get("/bad", (req, res, next) => {
  res.send({
    name: "error",
    problem: ["Unfortunately the page you are looking for does not exist"]
  });
});

app.use("/maintanence", (req, res, next) => {
  res.render("maintanence.hbs");
});
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
