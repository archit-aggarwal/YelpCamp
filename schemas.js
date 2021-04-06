const Joi = require('joi');

// This is JOI (NPM Package) Form Validator Schema for Campground
// Important Note: This is not MongoDB Campground Schema.
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});