const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

//index Rought
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Rought
router.get(
  "/:id",
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      return res.status(404).send("Listing not found.");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  wrapAysnc(async (req, res, next) => {
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
    console.log(newListing);
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  wrapAysnc(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;
