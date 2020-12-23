const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("database is connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).render("home");
  console.log(req.body);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page was not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // from ExpressError

  if (!err.message) {
    err.message = "Oops, something went wrong";
  }

  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
