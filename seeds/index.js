const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
let envHelpers;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log("dotenv required");
}

if (process.env.LOAD_RANDOM_IMG) {
  envHelpers = require("../env/pickRandomImg");
}

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("database was connected");
});

const seedDB = async () => {
  await Campground.deleteMany({}); // delete all

  for (let i = 0; i < 30; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const c = new Campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${descriptors[rand % descriptors.length]} ${
        places[rand % places.length]
      }`,
      image: process.env.LOAD_RANDOM_IMG
        ? envHelpers.pickRandomImg()
        : "https://source.unsplash.com/collection/483251",
      description:
        "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
      price: Math.floor(Math.random() * 30) + 10,
    });
    await c.save();
  }
};

seedDB();
