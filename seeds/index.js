const mongoose = require("mongoose");
const Toy = require("../models/toy.js");
const indata = require("./data.js");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/toy-heaven");
    console.log("Successfully Connected to The Mongoose Server");
  } catch (err) {
    console.log(`Sorry for error ${err}`);
  }
}

main();

const seedDB = async () => {
  await Toy.deleteMany({});
  indata.data = indata.data.map((obj) => ({
    ...obj,
    owner: "699151db4ece567db1862356",
  }));
  await Toy.insertMany(indata.data);
  console.log("Data was Initialized Successfully");
};

seedDB();
