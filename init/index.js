// Fills the database with sample listings.
// Run it with:  node init/index.js
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/lisiting.js");
const User = require("../models/user.js");
const geocode = require("../utils/geocode.js");
const { categories } = require("../schema.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connection to db");
}

// Sample listings need an owner. Use a demo user and create it if it is missing,
// instead of a hardcoded id that only exists on one computer.
async function getDemoOwner() {
    let owner = await User.findOne({ username: "demo" });
    if (!owner) {
        owner = await User.register(
            new User({ username: "demo", email: "demo@example.com" }),
            "demo1234"
        );
        console.log("created demo user  ->  username: demo  password: demo1234");
    }
    return owner;
}

const initDB = async () => {
    const owner = await getDemoOwner();
    await Listing.deleteMany({});

    const listings = [];
    for (let i = 0; i < initdata.data.length; i++) {
        const obj = initdata.data[i];
        const listing = {
            ...obj,
            owner: owner._id,
            category: categories[i % categories.length]
        };

        // puts the listing on the map (skipped if MAP_TOKEN is not set)
        const coords = await geocode(`${obj.location}, ${obj.country}`);
        if (coords) {
            listing.geometry = { type: "Point", coordinates: coords };
        }
        listings.push(listing);
    }

    await Listing.insertMany(listings);
    console.log("data was saved");
};

main()
    .then(initDB)
    .catch((err) => console.log(err))
    .finally(() => mongoose.connection.close());
