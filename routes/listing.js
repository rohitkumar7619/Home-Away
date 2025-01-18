const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAysnc(listingController.index)) //index Rought
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAysnc(listingController.createListing)
  ); //Create Route

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAysnc(listingController.showListing)) // Show Rought
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAysnc(listingController.updateListing)
  ) // Update Route
  .delete(isLoggedIn, isOwner, wrapAysnc(listingController.deleteListing)); //delete route

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAysnc(listingController.editListing)
);

module.exports = router;
