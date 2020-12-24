const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const {
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
} = require("../middleware");

const campgrounds = require("../controllers/campground");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    validateCampgroundSchema,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampgroundSchema,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampground)
);

module.exports = router;
