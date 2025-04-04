const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

// Landing Page Route (should be separate)
router.get("/", (req, res) => {
  res.render("listings/landing");
});

// Listings RESTful Routes (properly prefixed)
router
  .route("/listings")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// New Listing Route
router.get("/listings/new", isLoggedIn, listingController.renderNewForm);

// Static Pages (keep these in root)
router.get("/about", (req, res) => {
  res.render("listings/about");
});

router.get("/contact", (req, res) => {
  res.render("listings/contact");
});



// footer
router.get("/support", (req, res) => {
  res.render("footerListings/support");
});

router.get("/safety", (req, res) => {
  res.render("footerListings/safety");
});

router.get("/privacy", (req, res) => {
  res.render("footerListings/privacy");
});

router.get("/terms", (req, res) => {
  res.render("footerListings/terms");
});




// Individual Listing Routes
router
  .route("/listings/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit Route
router.get(
  "/listings/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//book
router.get("/listings/:id/book", isLoggedIn, wrapAsync(listingController.book));

//booking
router.post(
  "/listings/:id/booking",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { guests, email, phone, startDate, endDate } = req.body;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    const newBooking = new Booking({
      listing: id,
      user: req.user._id,
      guests,
      email,
      phone,
      startDate,
      endDate,
    });

    await newBooking.save();
    req.flash("success", "Booking confirmed!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
