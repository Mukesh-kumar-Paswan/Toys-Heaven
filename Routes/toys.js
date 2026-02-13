const express = require("express");
const router = express.Router();

const Toy = require("../models/toy.js");
const { toySchema } = require("../Utils/schema.js");

const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");


// Validation Middleware For Toy
const validateToy = (req, res, next) => {
  let { error } = toySchema.validate(req.body);

  if (error) {
    next(new ExpressError(400, error.details[0].message));
  } else {
    next();
  }
};


// Index Route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allToys = await Toy.find({});
    res.render("toys/index.ejs", { allToys });
  }),
);

// New Route

router.get("/new", (req, res) => {
  res.render("toys/new.ejs");
});

// Create Route

router.post(
  "/",
  validateToy,
  wrapAsync(async (req, res) => {
    const toy = req.body.toy;
    const newToy = new Toy(toy);
    await newToy.save();
    req.flash("success" , "new toy added to market place");
    res.redirect("/toys");
  }),
);

// Edit Route

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const toy = await Toy.findById(id);
    if(!toy) {
      req.flash("error" , "Toy is not available");
      res.redirect("/toys");
    };
    res.render("toys/edit.ejs", { toy });
  }),
);

// Update Route

router.put(
  "/:id",
  validateToy ,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const toy = await Toy.findByIdAndUpdate(id, { ...req.body.toy });
    req.flash("success" , "toy updated");
    res.redirect(`/toys/${id}`);
  }),
);

// Delete Route

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Toy.findByIdAndDelete(id);
    req.flash("success" , "toy successfully removed from market place");
    res.redirect("/toys");
  }),
);

// Show Route

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const toy = await Toy.findById(id).populate("reviews");
    if(!toy) {
      req.flash("error" , "Toy is not available");
      res.redirect("/toys");
    }
    res.render("toys/show.ejs", { toy });
  }),
);

module.exports = router;