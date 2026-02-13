const Joi = require("joi");

const toySchema = Joi.object({
  toy: Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    price: Joi.number().min(1).required(),
    image: Joi.string().uri().required(),
    category: Joi.string()
      .valid("Educational", "Action", "Puzzle", "Soft Toy", "Vehicle", "Others")
      .required(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(3).required(),
  }).required(),
})

module.exports = { toySchema , reviewSchema };
