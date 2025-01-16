const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAysnc = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Create  Review
router.post(
  "/",
  wrapAysnc(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete review route
router.delete(
  "/:reviewId",
  wrapAysnc(async (req, res) => {
    const { id, reviewId } = req.params; // Correct destructuring
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Fix typo and use reviewId
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`); // Use id directly for redirection
  })
);

module.exports = router;
