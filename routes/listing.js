const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

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

module.exports = router;
