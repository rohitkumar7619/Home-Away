const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1734275012690-6d3006fba036?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/premium_photo-1734275012690-6d3006fba036?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
