const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

// const wrapAsync = require("./utils/warpAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} =require("./schema.js")

// const Listing = require("./models/lisiting.js");
// const Review = require("./models/reviews.js");
app.use(express.urlencoded({extended:true}));

const listingRoute = require("./Routes/listings.js");
const reviewRoute = require("./Routes/reviews.js");
const userRoute = require("./Routes/user.js");
const Session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine" , "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));



const sessionOption ={
    secret :"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie :{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    
};

main()
.then(()=>{
    console.log("connection to db")
}).catch((err)=>{
    console.log(err);
});


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

};
app.get("/", (req, res)=>{
    res.redirect("/listings");
});

app.use(Session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demo", async(req, res)=>{
//     let fakeUser = new User({
//         email:"sample@me.com",
//         username:"sample"
//     });
//          let newRegisteredUser = await User.register(fakeUser, "password");
//            res.send(newRegisteredUser);
//     });
 
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/user", userRoute);



    
// app.get("/testlisting", async(req, res)=>{

//     let sampleListng = new Listing({
//        title:"My New Destination",
//        description:"By the beach",
//        price:20_000,
//        location:"California",
//        country:"USA"
//     });

//    await sampleListng.save();
//    console.log("sample was saved");
//    res.send("testing successful")
    
// });


// app.all((req, res, next)=>{
//     next(new ExpressError(404, "page not found"));
// });




app.use((err, req, res, next)=>{
    let{status=500 , message="something went wrong"}= err;
    res.status(status).send(message);
    // res.send("something went wrong");
});





app.listen(8080,()=>{
    console.log("server is running");
});