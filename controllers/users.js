const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  // catch it manually so errors appear in a flash message

  try {
    const { email, username, password } = req.body;

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next();
      }
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}`);

  const redirectUrl = req.session.returnTo || "/campgrounds";
  res.redirect(redirectUrl);

  delete req.session.returnTo;
};

module.exports.logOut = (req, res) => {
  req.logOut();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
};
