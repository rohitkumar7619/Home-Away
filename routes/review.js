const express = require("express");
const router = express.Router({ mergeParams: true });
const { createReview, deleteReview } = require("../controllers/reviews.js");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

// Create Review
router.post("/", isLoggedIn, wrapAsync(createReview));

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
