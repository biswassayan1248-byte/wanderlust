const Joi = require("joi");

// Used by the filter bar, the listing forms, the model and the validation below.
const categories = [
    "Trending",
    "Rooms",
    "Iconic cities",
    "Mountains",
    "Castles",
    "Amazing pools",
    "Camping",
    "Farms",
    "Arctic"
];

module.exports.categories = categories;

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        category: Joi.string().valid(...categories),
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }).allow("", null)
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
