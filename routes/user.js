const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.get(
  "/signup",
  wrapAsync(async (req, res) => {
    res.render("users/signup.ejs");
  })
);

module.exports = router;
