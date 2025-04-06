const { required } = require("joi");
const Listing = require("./models/listing");
const Review = require("./models/review");
const user  = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = (req, res, next) => {
  const { id } = req.params;
  Listing.findById(id)
    .populate("owner") // populate owner to ensure we have owner data
    .then((listing) => {
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
      // Compare the current user with the owner of the listing
      if (!req.user || !listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit this listing");
        return res.redirect(`/listings/${listing._id}`);
      }
      next();
    })
    .catch((err) => {
      req.flash("error", "Something went wrong");
      res.redirect("/listings");
    });
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You do not have permission to edit and delete this review"
    );
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// admin
module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash("error", "You don't have permission to access this page");
  res.redirect("/listings");
};
