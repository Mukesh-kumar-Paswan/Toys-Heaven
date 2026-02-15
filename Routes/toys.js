const express = require("express");
const router = express.Router();
const Toy = require("../models/toy.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateToy } = require("../Utils/middleware.js");

// Index Route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allToys = await Toy.find({});
    res.render("toys/index.ejs", { allToys });
  }),
);

// New Route

router.get("/new", isLoggedIn, (req, res) => {
  res.render("toys/new.ejs");
});

// Create Route

router.post(
  "/",
  isLoggedIn,
  validateToy,
  wrapAsync(async (req, res) => {
    const toy = req.body.toy;
    const newToy = new Toy(toy);
    newToy.owner = req.user._id;
    await newToy.save();
    req.flash("success", "new toy added to market place");
    res.redirect("/toys");
  }),
);

// Edit Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const toy = await Toy.findById(id);
    if (!toy) {
      req.flash("error", "Toy is not available");
      res.redirect("/toys");
    }
    res.render("toys/edit.ejs", { toy });
  }),
);

// Update Route

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateToy,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const toy = await Toy.findByIdAndUpdate(id, { ...req.body.toy });
    req.flash("success", "toy updated");
    res.redirect(`/toys/${id}`);
  }),
);

// Delete Route

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Toy.findByIdAndDelete(id);
    req.flash("success", "toy successfully removed from market place");
    res.redirect("/toys");
  }),
);

// Show Route

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const toy = await Toy.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!toy) {
      req.flash("error", "Toy is not available");
      res.redirect("/toys");
    }
    res.render("toys/show.ejs", { toy });
  }),
);

module.exports = router;
