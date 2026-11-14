const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const {isLoggedIn, isOwner,validateListings} = require("../middleware.js");

const listingController = require("../controlllers/listings.js");
const multer = require('multer');
// const {storage} = require("../cloudConfig.js")
// const upload =multer({storage})

// new Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

// index Route, //create route
router.route("/")
 .get(wrapAsync(listingController.index))
//  .post( isLoggedIn,
//         validateListings,
//          wrapAsync(listingController.createListing));
   // .post(upload.single('listing[image]'),(req, res)=>{
   //    res.send(req.file);
   // });

  //Show Route, //update Route, //delete Route 
router.route("/:id")
 .get(wrapAsync(listingController.showListings))
  .put( isLoggedIn ,isOwner, validateListings,
     wrapAsync(listingController.updateListings))
  .delete( isLoggedIn, isOwner,
      wrapAsync( listingController.destroyListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, 
     wrapAsync( listingController.renderEditForm));


module.exports = router;