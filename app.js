const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const { render } = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAysnc = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/homeaway";

main()
  .then(() => {
    console.log("connected with DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("hi,i ma root");
});

app.use("/listings", listings);

//Create  Review
app.post(
  "/listings/:id/reviews",
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
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAysnc(async (req, res) => {
    const { id, reviewId } = req.params; // Correct destructuring
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Fix typo and use reviewId
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`); // Use id directly for redirection
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { err });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listing to port 8080");
});
