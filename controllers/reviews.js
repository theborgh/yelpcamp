const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  const cg = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id; // add author ID to the review before saving it to DB
  cg.reviews.push(review);
  await review.save();
  await cg.save();

  req.flash("success", "Review created");
  res.redirect(`/campgrounds/${cg.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;

  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // $pull operator from Mongo
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted");
  res.redirect(`/campgrounds/${id}`);
};
