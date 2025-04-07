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


// Promote/Demote User
router.post(
  "/admin/users/:id/toggle-admin",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }
    
    // Can't modify own admin status
    if (user._id.equals(req.user._id)) {
      req.flash("error", "You cannot modify your own admin status");
      return res.redirect("/admin/users");
    }
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    req.flash("success", `User ${user.username} ${user.isAdmin ? "promoted to admin" : "demoted from admin"}`);
    res.redirect("/admin/users");
  })
);

// Delete Listing (Admin)
router.delete(
  "/admin/listings/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/admin/listings");
  })
);

module.exports = router;