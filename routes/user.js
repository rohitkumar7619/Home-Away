const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const usersControllers = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware");

// Render Signup Form
router.get("/signup", usersControllers.signupForm);

// Handle Signup Logic
router.post("/signup", wrapAsync(usersControllers.signup));

// Render Login Form
router.get("/login", usersControllers.loginForm);

// Handle Login Logic
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

// Logout Route
router.get("/logout", usersControllers.logout);

module.exports = router;
