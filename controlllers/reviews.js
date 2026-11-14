const Listing =require("../models/lisiting");
const Review = require("../models/review");


module.exports.createReview = async(req, res)=>{
   let listings=  await Listing.findById(req.params.id);
   let Newreview = new Review(req.body.review);
   Newreview.author = req.user._id;
   listings.reviews.push(Newreview);
   await Newreview.save();
   await listings.save();

   req.flash("success", "Successfully added a review");
    res.redirect(`/listings/${listings._id}`);

};



module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/listings/${id}`);
};