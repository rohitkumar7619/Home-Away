const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js"); // Use the model, not the schema

// Render Signup Form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// Handle Signup Logic
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // Create a new user instance
      const newUser = new User({ username, email });

      // Register the user with passport-local-mongoose
      const registeredUser = await User.register(newUser, password);
      console.log("Registered User:", registeredUser);

      // Automatically log the user in after registration
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Home Away!");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// Handle Login Logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/listings"; // Redirect to intended page or default
    delete req.session.returnTo; // Clean up session
    res.redirect(redirectUrl);
  }
);

module.exports = router;
