const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const userController = require("../controlllers/users.js");

// new user
router.route("/")
.get(userController.renderSignupForm)
// create user
.post(wrapAsync(userController.signup));


// user login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
     passport.authenticate("local", 
    {failureFlash: true, 
     failureRedirect: "/user/login"}), 
    wrapAsync(userController.login));



router.get("/logout", userController.logout);

module.exports = router;