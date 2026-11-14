const mongoose = require("mongoose");
const Reviews = require("./review");
const { categories } = require("../schema.js");

const Schema = mongoose.Schema;

// Shown when a listing has no photo (file lives in public/images)
const DEFAULT_IMAGE = "/images/placeholder.svg";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: DEFAULT_IMAGE,
            // an empty value from a form falls back to the default image
            set: (v) => (v === "" || v == null ? DEFAULT_IMAGE : v)
        }
    },
    price: {
        type: Number,
        default: 0
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    category: {
        type: String,
        enum: categories,
        default: "Trending"
    },
    // map position as [longitude, latitude]; missing for old listings
    geometry: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number]
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Reviews.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
