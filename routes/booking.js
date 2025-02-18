const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

// View All Bookings
router.get(
  "/bookings",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "listing"
    );
    res.render("bookings/index", { bookings });
  })
);

// Delete Booking
router.delete(
  "/bookings/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking deleted successfully!");
    res.redirect("/bookings");
  })
);

module.exports = router;
