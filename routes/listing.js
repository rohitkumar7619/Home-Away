const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//index Rought
router.get("/", wrapAysnc(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Rought
router.get("/:id", wrapAysnc(listingController.showListing));

//Create Route
router.post("/", isLoggedIn, wrapAysnc(listingController.createListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAysnc(listingController.editListing)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAysnc(listingController.updateListing)
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAysnc(listingController.deleteListing)
);

module.exports = router;
