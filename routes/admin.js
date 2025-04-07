// routes/admin.js
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
    // Get counts for dashboard
    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user")
      .populate("listing");

    res.render("admin/dashboard", {
      userCount,
      listingCount,
      bookingCount,
      recentBookings
    });
  })
);

// Manage Users
router.get(
  "/admin/users",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const users = await User.find();
    res.render("admin/users", { users });
  })
);

// Manage Listings
router.get(
  "/admin/listings",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const listings = await Listing.find().populate("owner");
    res.render("admin/listings", { listings });
  })
);


// Manage Bookings
router.get(
  "/admin/bookings",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const bookings = await Booking.find()
      .populate("user")
      .populate("listing");
    res.render("admin/bookings", { bookings });
  })
);


module.exports = router;