const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Helper function to calculate booking nights and revenue
const calculateBookingRevenue = (bookings) => {
  return bookings.reduce((total, booking) => {
    if (!booking.listing || !booking.startDate || !booking.endDate) {
      return total;
    }
    const nights = Math.ceil(
      (new Date(booking.endDate) - new Date(booking.startDate)) /
      (1000 * 60 * 60 * 24)
    );
    return total + booking.listing.price * nights;
  }, 0);
};

// Dashboard Route
router.get(
  "/admin/dashboard",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const [
      userCount,
      listingCount,
      bookingCount,
      recentBookings,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "username email")
        .populate("listing", "title price"),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("username email createdAt")
    ]);

    const allBookings = await Booking.find().populate("listing", "price").lean();
    const totalRevenue = calculateBookingRevenue(allBookings);

    res.render("admin/dashboard", {
      userCount,
      listingCount,
      bookingCount,
      recentBookings,
      recentUsers,
      totalRevenue
    });
  })
);

// Manage Users
router.get(
  "/admin/users",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("username email isAdmin createdAt");

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
    const listings = await Listing.find()
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    res.render("admin/listings", {
      listings,
      currUser: req.user,
      currentPage: "admin"
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
      .populate("user", "username email")
      .populate("listing", "title price")
      .sort({ createdAt: -1 });

    res.render("admin/bookings", {
      bookings,
      currUser: req.user
    });
  })
);

// ✅ Fixed: Toggle Admin Status
router.post(
  "/admin/users/:id/toggle-admin",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      req.flash("error", "You cannot modify your own admin status");
      return res.redirect("/admin/users");
    }

    const user = await User.findByIdAndUpdate(
      id,
      [{ $set: { isAdmin: { $not: "$isAdmin" } } }],
      { new: true }
    );

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }

    req.flash(
      "success",
      `User ${user.username} ${user.isAdmin ? "promoted to admin" : "demoted from admin"}`
    );
    res.redirect("/admin/users");
  })
);

// Delete Listing
router.delete(
  "/admin/listings/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/admin/listings");
    }

    req.flash("success", "Listing deleted successfully");
    res.redirect("/admin/listings");
  })
);

// Delete Booking
router.delete(
  "/admin/bookings/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/admin/bookings");
    }

    req.flash("success", "Booking deleted successfully");
    res.redirect("/admin/bookings");
  })
);

// Delete User
router.delete(
  "/admin/users/:id/delete",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      req.flash("error", "You cannot delete your own account");
      return res.redirect("/admin/users");
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }

    await Promise.all([
      Listing.deleteMany({ owner: id }),
      Booking.deleteMany({ user: id })
    ]);

    req.flash("success", "User deleted successfully");
    res.redirect("/admin/users");
  })
);

// Charts Dashboard
router.get(
  "/admin/charts",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const now = new Date();

    const [
      totalBookings,
      totalUsers,
      activeListings,
      bookings,
      bookingStatusCounts
    ] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments(),
      Listing.countDocuments({ isActive: true }),
      Booking.find().populate("listing", "price"),
      Booking.aggregate([
        {
          $facet: {
            upcoming: [
              { $match: { startDate: { $gt: now } } },
              { $count: "count" }
            ],
            completed: [
              { $match: { endDate: { $lt: now } } },
              { $count: "count" }
            ],
            cancelled: [
              { $match: { status: "cancelled" } },
              { $count: "count" }
            ]
          }
        }
      ])
    ]);

    const totalRevenue = calculateBookingRevenue(bookings);
    const recentTransactions = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username")
      .populate("listing", "title");

    res.render("admin/charts", {
      totalBookings,
      totalRevenue,
      activeListings,
      totalUsers,
      upcomingBookings: bookingStatusCounts[0].upcoming[0]?.count || 0,
      completedBookings: bookingStatusCounts[0].completed[0]?.count || 0,
      cancelledBookings: bookingStatusCounts[0].cancelled[0]?.count || 0,
      recentTransactions
    });
  })
);

module.exports = router;
