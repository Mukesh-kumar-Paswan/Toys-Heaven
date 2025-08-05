const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Mongo_URL = "mongodb://127.0.0.1:27017/ToyHeaven";

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

app.listen(port , () => {
    console.log("Server is Listening at port 8080");
});

app.get("/" , (req , res) => {
    res.send("Welcome to the toys heaven");
})