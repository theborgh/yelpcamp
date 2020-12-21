const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const { runInNewContext } = require("vm");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("database was connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).render("home");
  console.log(req.body);
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.status(200).render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.status(200).render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  // res.send(req.body);

  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.status(200).render("campgrounds/show", { campground });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
