const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const { render } = require("ejs");
const path = require("path");

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

app.get("/", (req, res) => {
  res.send("hi,i ma root");
});

//index Rought
app.get("/listing", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Rought
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).send("Listing not found.");
  }
  res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listings);
  await newListing.save();
  res.redirect("/listing");
  console.log(newListing);
});

// app.get("/testListing", async (req, res) => {
//   const sampleListing = new Listing({
//     title: "my Home",
//     description: "ji mera ghar hai",
//     Price: 5000,
//     Location: "Kunraghat",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("sucessful testing");
// });

app.listen(8080, () => {
  console.log("server is listing to port 8080");
});
