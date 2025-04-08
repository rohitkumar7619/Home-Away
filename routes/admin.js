// routes/admin.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Update the dashboard route in routes/admin.js
router.get(
  "/admin/dashboard",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    // Get counts for dashboard
    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    // Get recent bookings with populated data
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user")
      .populate("listing");
    
    // Get recent users (5 most recently created)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Calculate total revenue from all bookings
    const allBookings = await Booking.find().populate("listing");
    let totalRevenue = 0;
    
    allBookings.forEach(booking => {
      const nights = Math.ceil(
        (new Date(booking.endDate) - new Date(booking.startDate)) / 
        (1000 * 60 * 60 * 24)
      );
      totalRevenue += booking.listing.price * nights;
    });

    res.render("admin/dashboard", {
      userCount,
      listingCount,
      bookingCount,
      recentBookings,
      recentUsers, // Make sure this is included
      totalRevenue: totalRevenue || 0 // Ensure it's always defined
    });
  })
);


// Manage Users
// In your route, manually add createdAt if it doesn't exist
router.get(
  "/admin/users",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    let users = await User.find().sort({ _id: -1 }); // Sort by ID as fallback
    
    // Add default createdAt if missing
    users = users.map(user => {
      if (!user.createdAt) {
        user.createdAt = new Date(); // Or use some other default date
        // Note: This doesn't save to DB, just for display purposes
      }
      return user;
    });
    
    res.render("admin/users", { 
      users,
      currUser: req.user
    });
  })
);

// Manage Listings

router.get(
  "/admin/listings",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const listings = await Listing.find().populate("owner");
    res.render("admin/listings", { 
      listings,
      currUser: req.user,
      currentPage: 'admin' // Add this line to identify the current page
    });
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

// Delete Booking (Admin)
router.delete(
  "/admin/bookings/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking deleted successfully");
    res.redirect("/admin/bookings");
  })
);

// Add this to your admin routes
router.delete(
  "/admin/users/:id/delete",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }
    
    // Can't delete yourself
    if (user._id.equals(req.user._id)) {
      req.flash("error", "You cannot delete your own account");
      return res.redirect("/admin/users");
    }
    
    await User.findByIdAndDelete(id);
    req.flash("success", "User deleted successfully");
    res.redirect("/admin/users");
  })
);


// Admin Charts Dashboard
router.get(
  "/admin/charts",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    // Get counts for dashboard
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeListings = await Listing.countDocuments({ isActive: true });
    
    // Calculate total revenue
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    // Get booking status counts
    const now = new Date();
    const upcomingBookings = await Booking.countDocuments({ startDate: { $gt: now } });
    const completedBookings = await Booking.countDocuments({ endDate: { $lt: now } });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });
    
    // Get recent transactions with proper error handling
    const recentTransactions = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user")
      .populate("listing")
      .lean(); // Convert to plain JavaScript objects
    
    // Ensure all transactions have required fields
    const safeTransactions = recentTransactions.map(t => ({
      ...t,
      totalPrice: t.totalPrice || 0, // Default to 0 if undefined
      startDate: t.startDate || new Date(),
      createdAt: t.createdAt || new Date()
    }));

    res.render("admin/charts", {
      totalBookings,
      totalRevenue,
      activeListings,
      totalUsers,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      recentTransactions: safeTransactions
    });
  })
);

module.exports = router;