const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listings.location,
      limit: 1,
    })
    .send();

  console.log(response.body.features[0].geometry);
  res.send("done");

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(filename, "..", url);
  const newListing = new Listing(req.body.listings);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
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
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listings,
    });

    if (req.file) {
      const { path: url, filename } = req.file;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing Successfully Updated");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while updating the listing.");
    res.redirect("back");
  }
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Listing Successfully");
  res.redirect("/listings");
};