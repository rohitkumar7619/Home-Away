const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

//index Rought
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Rought
router.get(
  "/:id",
  wrapAysnc(async (req, res) => {
    const { id } = req.params; // Extract `id` from params
    const currUser = req.user; // Current logged-in user

    // Find the listing by ID and populate required fields
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } }) // Nested populate for reviews
      .populate("owner"); // Populate owner of the listing

    // If the listing is not found, flash an error and redirect
    if (!listing) {
      req.flash("error", "Cannot find that Listing");
      return res.redirect("/listings");
    }

    // Render the `listings/show.ejs` template with the listing and current user
    res.render("listings/show.ejs", { listing, currUser });
  })
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  wrapAysnc(async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
    console.log(newListing);
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Cannot find that Listing");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAysnc(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    req.flash("success", "Listing Successfully Updated");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Deleted Listing Successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
