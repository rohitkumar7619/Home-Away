const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const currUser = req.user;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) // Nested populate for reviews
    .populate("owner"); // Populate owner of the listing

  if (!listing) {
    req.flash("error", "Cannot find that Listing");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, currUser });
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listings);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that Listing");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listings });
  req.flash("success", "Listing Successfully Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Listing Successfully");
  res.redirect("/listings");
};
