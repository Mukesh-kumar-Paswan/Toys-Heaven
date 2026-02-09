// Requiring important files
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Toy = require("./models/toy.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./Utils/wrapAsync.js");
const ExpressError = require("./Utils/ExpressError.js");
const { toySchema } = require("./Utils/schema.js");

// Setting EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Validation Middleware For Toy
const validateToy = (req, res, next) => {
  let { error } = toySchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Starting the server
const port = 8080;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send(`<h1>Thankyou for visiting. Work in progress :) <h1>`);
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

// Index Route

app.get(
  "/toys",
  wrapAsync(async (req, res) => {
    const allToys = await Toy.find({});
    res.render("toys/index.ejs", { allToys });
  }),
);

// New Route

app.get("/toys/new", (req, res) => {
  res.render("toys/new.ejs");
});

// Create Route

app.post(
  "/toys",
  validateToy,
  wrapAsync(async (req, res) => {
    const toy = req.body.toy;
    const newToy = new Toy(toy);
    await newToy.save();
    res.redirect("/toys");
  }),
);

// Edit Route

app.get(
  "/toys/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const toy = await Toy.findById(id);
    res.render("toys/edit.ejs", { toy });
  }),
);

// Update Route

app.put(
  "/toys/:id",
  validateToy ,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const toy = await Toy.findByIdAndUpdate(id, { ...req.body.toy });
    res.redirect(`/toys/${id}`);
  }),
);

// Delete Route

app.delete(
  "/toys/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Toy.findByIdAndDelete(id);
    res.redirect("/toys");
  }),
);

// Show Route

app.get(
  "/toys/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const toy = await Toy.findById(id);
    res.render("toys/show.ejs", { toy });
  }),
);

// Error page

app.get("/error", (req, res) => {
  throw new ExpressError(404, "Checking for Error.ejs");
});

// Error Handling Route

app.use((err, req, res, next) => {
  let { status = 500, message = "some thing went wrong" } = err;
  res.status(status).render("toys/error.ejs", { err: message });
});
