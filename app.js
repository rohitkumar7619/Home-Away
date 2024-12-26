const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

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

app.get("/", (req, res) => {
  res.send("hi,i ma root");
});

app.get("/testListing", async (req, res) => {
  const sampleListing = new Listing({
    title: "my Home",
    description: "ji mera ghar hai",
    Price: 5000,
    Location: "Kunraghat",
    country: "India",
  });
  await sampleListing.save();
  console.log("sample was saved");
  res.send("sucessful testing");
});

app.listen(8080, () => {
  console.log("server is listing to port 8080");
});
