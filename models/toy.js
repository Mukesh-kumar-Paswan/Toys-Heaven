const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const toySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default:
      "https://imgs.search.brave.com/_VY31-UkVObylxemeJIeXZXw13MOUz0Qd_27ncUkwBs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE3LzczLzYzLzcx/LzM2MF9GXzE3NzM2/MzcxNzlfT2xiNnlE/SWlxREVtSkRHcTE5/ZGJqM2R2eHhHbzB5/d1MuanBn",
  },
  price: {
    type: Number,
    default:100,
    min:1,
  },
  category: {
    type: String,
    enum: ["Educational", "Action", "Puzzle", "Soft Toy", "Vehicle" , "Others"],
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
});

toySchema.post("findOneAndDelete" , async(toy) => {
  if(toy) {
    await Review.deleteMany({ _id: {$in : toy.reviews}});
  }
});

const Toy = mongoose.model("Toy" , toySchema);
module.exports = Toy;


