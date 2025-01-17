const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

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
    let { id } = req.params;
    const currUser = req.user;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Cannot find that Listing");
      return res.redirect("/listings");
    }
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
  wrapAysnc(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Deleted Listing Successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
