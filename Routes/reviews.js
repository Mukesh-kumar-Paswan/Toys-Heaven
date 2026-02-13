const express = require("express");
const router = express.Router({mergeParams: true});

const Toy = require("../models/toy.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../Utils/schema.js");

const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");


// Validation Middleware For Review
const validateReview = (req , res , next) => {
  let {error} = reviewSchema.validate(req.body);

  if(error) {
    next(new ExpressError(400 , error.details[0].message));
  } else {
    next();
  }
}

// Reviews Post Route
router.post("/" , validateReview , wrapAsync( async (req , res) => {
  let {id} = req.params;
  let toy = await Toy.findById(id);
  let newReview = new Review(req.body.review);

  toy.reviews.push(newReview);

  await newReview.save();
  await toy.save();
  req.flash("success" , "new review created");
  res.redirect(`/toys/${id}`);
}));

// Reviews Delete Route
router.delete("/:reviewId" , wrapAsync( async (req , res) => {
  let {id , reviewId} = req.params;

  let deletedReviewId = await Toy.findByIdAndUpdate(id , {$pull: {reviews : reviewId} });
  let deletedReview = await Review.findByIdAndDelete(reviewId); 

  req.flash("success" , "review deleted successfully");
  res.redirect(`/toys/${id}`);
}))

module.exports = router;