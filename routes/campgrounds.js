const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const {
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
} = require("../middleware");

const campgrounds = require("../controllers/campground");

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateCampgroundSchema,
  catchAsync(campgrounds.createCampground)
);

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampground)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
  catchAsync(campgrounds.updateCampground)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
