const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const usersControllers = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware");

router
  .route("/signup")
  .get(usersControllers.signupForm) // Render Signup Form
  .post(wrapAsync(usersControllers.signup)); // Handle Signup Logic

router
  .route("/login")
  .get(usersControllers.loginForm) // Render Login Form
  .post(
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
  ); // Handle Login Logic

// Logout Route
router.get("/logout", usersControllers.logout);

module.exports = router;
