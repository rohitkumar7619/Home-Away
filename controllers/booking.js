const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

module.exports.showBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "listing"
  );
  res.render("bookings/index", { bookings });
};
