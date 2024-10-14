const Joi = require("joi");

module.exports.itemSchema = Joi.object({
  item: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string(),
    phone:Joi.string(),
    image: Joi.string().allow("", null),
  }).required(),
});

module.exports.feedbackSchema = Joi.object({
  feedback: Joi.object({
    comment: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date()),
  }).required(),
});
