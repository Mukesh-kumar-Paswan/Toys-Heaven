// Requiring important files
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const toysRouter = require("./Routes/toys.js");
const reviewsRouter = require("./Routes/reviews.js");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const userRouter = require("./Routes/user.js");

// authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Setting EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session
const sessionOption = {
  secret: "ourToySecret",
  resave: false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000, 
    httpOnly : true,
  },
};

app.use(session(sessionOption));
// Flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


// Starting the server
const port = 8080;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// Setting Mongoose Server

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/toy-heaven");
    console.log("Successfully Connected to The Mongoose Server");
  } catch (err) {
    console.log(`Sorry for error ${err}`);
  }
}

main();

// Toy Route
app.use("/toys", toysRouter);

// Review Route
app.use("/toys/:id/reviews", reviewsRouter);

// User Route
app.use("/" , userRouter);

// Home Page
app.get("/", (req, res) => {
  res.send(`<h1>Thankyou for visiting. Work in progress :) <h1>`);
});

// Error page
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handling Route
app.use((err, req, res, next) => {
  let { status = 500, message = "some thing went wrong" } = err;
  res.status(status).render("toys/error.ejs", { err: message });
});
