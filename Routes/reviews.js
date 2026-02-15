const express = require("express");
const router = express.Router({ mergeParams: true });

const Toy = require("../models/toy.js");
const Review = require("../models/review.js");

const wrapAsync = require("../Utils/wrapAsync.js");

const { validateReview , isLoggedIn , isReviewAuthor } = require("../Utils/middleware.js");

// Reviews Post Route
router.post(
  "/",
  isLoggedIn ,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let toy = await Toy.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    toy.reviews.push(newReview);

    await newReview.save();
    await toy.save();
    req.flash("success", "new review created");
    res.redirect(`/toys/${id}`);
  }),
);

// Reviews Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn ,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let deletedReviewId = await Toy.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    let deletedReview = await Review.findByIdAndDelete(reviewId);

    req.flash("success", "review deleted successfully");
    res.redirect(`/toys/${id}`);
  }),
);

module.exports = router;
