const Joi = require("joi");

const toySchema = Joi.object({
    toy: Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(5).required(),
        price: Joi.number().min(1).required(),
        image: Joi.string().uri().required(),
    }).required(),
});

module.exports = {toySchema};