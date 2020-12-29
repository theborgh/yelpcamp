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
  console.log("database is connected");
});

const seedDB = async () => {
  await Campground.deleteMany({}); // delete all

  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const c = new Campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${descriptors[rand % descriptors.length]} ${
        places[rand % places.length]
      }`,
      images: [
        {
          url:
            "https://res.cloudinary.com/duttyuznh/image/upload/v1609236640/YelpCamp/mhztsd4tfizefh5obg6i.png",
          filename: "YelpCamp/mhztsd4tfizefh5obg6i",
        },
        {
          url:
            "https://res.cloudinary.com/duttyuznh/image/upload/v1609236645/YelpCamp/emcwvd0pc2rpak3hkpcl.png",
          filename: "YelpCamp/emcwvd0pc2rpak3hkpcl",
        },
      ],
      description:
        "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem",
      price: Math.floor(Math.random() * 30) + 10,
      reviews: [],
      author: "5fe44aba5212e5050c0cc711",
    });
    await c.save();
  }
};

seedDB();
