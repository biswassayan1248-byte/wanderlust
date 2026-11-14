const Listing =require("../models/lisiting");
const {listingSchema} =require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
module.exports.index = async(req, res)=>{

      const allListing = await Listing.find({});
      res.render("listings/index.ejs", {allListing});

};


module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};


module.exports.showListings =  async (req, res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id)
     .populate({path:"reviews",
           populate:{path:"author"}
     })
     .populate("owner");
     
     if(!listing){
        req.flash("error", "Listing does not found");
        res.redirect("/listings");
     }

     res.render("listings/show.ejs", {listing});
    
};


module.exports.createListing = async(req, res, next)=>{
       console.log(req.body);
   let result = listingSchema.validate(req.body);
    if(result.error){
            throw new ExpressError(400, "send valid data for listings");
    }
      const newListings = new Listing(req.body.listing);
     
      newListings.owner = req.user._id;
    await newListings.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
};


module.exports.renderEditForm = async(req, res)=>{
     let{id}= req.params;
     let listing = await Listing.findById(id);

     if(!listing){
        req.flash("error", "Listing does not found");
        res.redirect("/listings");
     }

     res.render("listings/edit.ejs", {listing});

};


module.exports.updateListings = async(req,res)=>{
    if(!req.body.listing){
            throw new ExpressError(400, "send valid data for listings");
    }
     let{id}= req.params;
      await Listing.findByIdAndUpdate(id, {...req.body.listing});
       req.flash("success", "Successfully updated a listing");
       res.redirect(`/listings/${id}`);
};



module.exports.destroyListing =async(req, res)=>{
      let{id}= req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing");
     res.redirect("/listings");
};

