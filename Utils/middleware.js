const Toy = require("../models/toy");
const Review = require("../models/review.js");
const wrapAsync = require("./wrapAsync");
const ExpressError = require("./ExpressError.js");
const { toySchema , reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "User's Must Be Logged To Edit Toys");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapAsync( async (req , res , next) => {
  let {id} = req.params;
  let toy = await Toy.findById(id);
  if(!toy.owner.equals(res.locals.currUser._id)) {
    req.flash("error" , "You'r not the owner of this Toy");
    return res.redirect("/toys");
  }
  next();
});

module.exports.validateToy = (req, res, next) => {
  let { error } = toySchema.validate(req.body);

  if (error) {
    next(new ExpressError(400, error.details[0].message));
  } else {
    next();
  }
};

module.exports.validateReview = (req , res , next) => {
  let {error} = reviewSchema.validate(req.body);

  if(error) {
    next(new ExpressError(400 , error.details[0].message));
  } else {
    next();
  }
};

module.exports.isReviewAuthor = wrapAsync(async(req , res , next) => {
  let {id , reviewId} = req.params;
  let reivew = await Review.findById(reviewId);
  if(!reivew.author.equals(res.locals.currUser._id)) {
    req.flash("error" , "You'r not the author of this review");
    return res.redirect(`/toys/${id}`);
  }
  next();
})