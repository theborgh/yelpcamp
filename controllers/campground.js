const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.status(200).render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.status(200).render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully created a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    // populate the review for each campground and the author for each review inside it
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    // populate the author of each campground (see REF field in model)
    .populate("author");

  if (!campground) {
    req.flash("error", "Campground is not available");
    res.redirect("/campgrounds");
  } else {
    res.status(200).render("campgrounds/show", { campground });
  }
};

module.exports.editCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id);

  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }

  res.status(200).render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const camp = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });

  req.flash("success", "Campground was updated");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to delete this campground");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  await Campground.findByIdAndDelete(id);

  req.flash("success", "Campground was deleted");
  res.redirect("/campgrounds");
};
