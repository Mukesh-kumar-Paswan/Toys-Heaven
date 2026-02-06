// Requiring important files
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Toy = require("./models/toy.js");
const path = require("path");
const methodOverride = require("method-override")

// Setting EJS
app.set("view engine" , "ejs")
app.set("views" , path.join(__dirname , "views"));

// Middlewares
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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

app.get("/toys" , async (req , res) => {
  const allToys = await Toy.find({});
  res.render("toys/index.ejs" , {allToys});
});

// New Route

app.get("/toys/new" , (req , res) => {
  res.render("toys/new.ejs");
});

// Create Route

app.post("/toys" , async (req , res) => {
  const toy = req.body.toy;
  const newToy = new Toy(toy);
  await newToy.save();
  res.redirect("/toys");
});

// Edit Route

app.get("/toys/:id/edit" , async (req , res) => {
  const {id} = req.params;
  const toy = await Toy.findById(id);
  res.render("toys/edit.ejs" , {toy});
});

// Update Route

app.put("/toys/:id" , async (req , res) => {
  let {id} = req.params;
  const toy = await Toy.findByIdAndUpdate(id , {...req.body.toy});
  res.redirect(`/toys/${id}`);
});

// Delete Route

app.delete("/toys/:id" , async (req , res) => {
  let {id} = req.params;
  await Toy.findByIdAndDelete(id);
  res.redirect("/toys"); 
})

// Show Route 

app.get("/toys/:id" , async (req , res) => {
  const {id} = req.params;
  const toy = await Toy.findById(id);
  res.render("toys/show.ejs" , {toy});
});