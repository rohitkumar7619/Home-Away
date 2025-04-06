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