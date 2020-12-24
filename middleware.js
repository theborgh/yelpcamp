module.exports.isLoggedIn = (req, res, next) => {
  // console.log("req.user = ", req.user); // added automatically by passport
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }

  next();
};
