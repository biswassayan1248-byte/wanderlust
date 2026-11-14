const Express = require("express");
const router = Express.Router({mergeParams: true});
const wrapAsync = require("../utils/warpAsync.js");
const {validateReviews, isLoggedIn, isReviewAuthor, saveRedirectUrl}=require("../middleware.js");

const reviewController = require("../controlllers/reviews.js");

//review Route
//post Route
router.post("/", isLoggedIn, validateReviews,
     wrapAsync(reviewController.createReview ));

//delete Route review
router.post("/:reviewId", 
    isLoggedIn,
    saveRedirectUrl,
    isReviewAuthor,
    wrapAsync( reviewController.destroyReview));


module.exports = router;
