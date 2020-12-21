const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

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

app.get("/", (req, res) => {
  res.status(200).render("home");
  console.log(req.body);
});

app.get("/newcampground", async (req, res) => {
  const camp = new Campground({
    title: "My first campground",
    description: "Cheap camping",
  });
  await camp.save();

  res.send(camp);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
