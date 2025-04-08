// models/user.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", userSchema);