const Listing = require("../models/lisiting");
const ExpressError = require("../utils/ExpressError.js");
const geocode = require("../utils/geocode.js");
const { categories } = require("../schema.js");

module.exports.index = async (req, res) => {
    const { category } = req.query;
    const filter = {};

    // only accept categories we know about
    if (category && categories.includes(category)) {
        filter.category = category;
    }

    const allListing = await Listing.find(filter);
    res.render("listings/index.ejs", {
        allListing,
        categories,
        activeCategory: filter.category || null
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { categories });
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // image uploaded to Cloudinary by multer
    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    // find the location on the map
    const coords = await geocode(
        `${newListing.location}, ${newListing.country}`
    );
    if (coords) {
        newListing.geometry = { type: "Point", coordinates: coords };
    }

    await newListing.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing, categories });
};

module.exports.updateListings = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    const oldPlace = `${listing.location}, ${listing.country}`;
    listing.set(req.body.listing);

    // a new image is optional; without one the old image stays
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }

    // look up the map position again only if the place changed
    const newPlace = `${listing.location}, ${listing.country}`;
    if (newPlace !== oldPlace) {
        const coords = await geocode(newPlace);
        if (coords) {
            listing.geometry = { type: "Point", coordinates: coords };
        }
    }

    await listing.save();
    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
};
