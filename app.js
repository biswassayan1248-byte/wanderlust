if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

const listingRoute = require("./Routes/listings.js");
const reviewRoute = require("./Routes/reviews.js");
const userRoute = require("./Routes/user.js");

// ---------- settings from environment variables (.env) ----------
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set in production");
}
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-secret-change-me";

// ---------- app setup ----------
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connection to db");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(Session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/user", userRoute);

// any other url
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { status = 500, message = "Something went wrong" } = err;

    // a broken id in the url, like /listings/abc
    if (err.name === "CastError") {
        status = 404;
        message = "Page not found";
    }

    if (status === 500) {
        console.log(err);
    }

    res.status(status).render("listings/error.ejs", { message, status });
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
