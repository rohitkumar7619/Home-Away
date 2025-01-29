const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) // Index Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  ); // Create Route

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Route for contact page
router.get("/contact", (req, res) => {
  res.render("listings/contact");
});

// Route for about page
router.get("/about", (req, res) => {
  res.render("listings/about");
});

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  ) // Update Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete Route

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
