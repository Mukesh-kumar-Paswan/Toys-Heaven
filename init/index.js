const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
const { Mongo_URL } = require("../app.js");

main()
    .then(() => {
    console.log("Connected to DB");
    })
    .catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany (initdata.data);
    console.log("data was initialized");
}

initDB();