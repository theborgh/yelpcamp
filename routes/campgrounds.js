const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");

const validateCampgroundSchema = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.status(200).render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.status(200).render("campgrounds/new");
});

router.post(
  "/",
  validateCampgroundSchema,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();

    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.status(200).render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    res.status(200).render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampgroundSchema,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });

    req.flash("success", "Campground was updated");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Campground was deleted");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
