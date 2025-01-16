const express = require("express");
const router = express.Router();
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
        if (err) return next(err); // Pass login error to error middleware
        req.flash("success", "Welcome to Home Away!");
        res.redirect("/listings");
      });
    } catch (error) {
      // Handle errors during registration
      req.flash("error", error.message); // Flash the error message
      res.redirect("/signup"); // Redirect back to the signup page
    }
  })
);

module.exports = router;
