const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Admin Dashboard
router.get(
    "/admin/dashboard",
    isLoggedIn,
    isAdmin,
    wrapAsync(async (req, res) => {
      res.render("admin/dashboard", {
      });
    })
  );