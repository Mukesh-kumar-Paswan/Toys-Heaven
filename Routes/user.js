const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../Utils/middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const userRegistered = await User.register(newUser, password);
    req.login(userRegistered, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome ${username} to Toy-Heaven`);
      res.redirect("/toys");
    });
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// passport.authenticate() its a middleware to authenticate users
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome To Toy-Heaven");
    const redirectURL = res.locals.redirectUrl || "/toys";
    res.redirect(redirectURL);
  }),
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged-Out Successfully");
    res.redirect("/toys");
  });
});

module.exports = router;
