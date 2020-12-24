const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

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

const sessionConfig = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // must be after app.use(session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // specify how to store user in the session
passport.deserializeUser(User.deserializeUser()); // specify how to delete user from the session

// Middleware to set a variable to flash('success') so it doesn't need to be passed by the route handler
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is given by passport, accessing it helps with authorization/authentication in navbar, show page, etc (will be available as currentUser in template)
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).render("home");
});

// to delete
app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "test@gmail.com",
    username: "test",
  });

  const newUser = await User.register(user, "password");
  res.send(newUser);
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
