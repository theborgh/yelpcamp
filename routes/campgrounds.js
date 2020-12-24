const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");

const {
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
} = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.status(200).render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.status(200).render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampgroundSchema,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
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
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }

    res.status(200).render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
  catchAsync(async (req, res, next) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });

    req.flash("success", "Campground was updated");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to delete this campground");
      return res.redirect(`/campgrounds/${campground._id}`);
    }
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Campground was deleted");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
