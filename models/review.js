const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        // pass the function itself (no brackets) so every review gets its own time
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
