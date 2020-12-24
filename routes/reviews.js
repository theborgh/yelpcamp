const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview } = require("../middleware");

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res, next) => {
    const cg = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    cg.reviews.push(review);
    await review.save();
    await cg.save();

    req.flash("success", "Review created");
    res.redirect(`/campgrounds/${cg.id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // $pull operator from Mongo
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
