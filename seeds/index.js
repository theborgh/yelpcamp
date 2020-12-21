const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

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
  await Campground.deleteMany({});

  //   const c = new Campground({ title: "testing the connection" });
  //   await c.save();

  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const c = new Campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      description: `${descriptors[rand % descriptors.length]} ${
        places[rand % places.length]
      }`,
    });
    await c.save();
  }
};

seedDB().then(db.close());
