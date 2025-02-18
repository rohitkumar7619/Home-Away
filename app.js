if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const { render } = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const userSchema = require("./models/user.js");

const listings = require("./routes/listing.js");
const bookingRouter = require("./routes/booking.js");
const Booking = require("./models/booking.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
require("dotenv").config();

// const MONGO_URL = "mongodb://127.0.0.1:27017/homeaway";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected with DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
  });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("erro", () => {
  console.log("Error in MONGO SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveinitialized: true,
  Cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userSchema.authenticate()));

passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.currUser = req.user;
  next();
});

// Mount routers correctly
app.use("/", listings); // Landing page and static pages
app.use("/listings", listings); // Listings routes
app.use("/", bookingRouter); // Booking routes (handles POST /listings/:id/book)
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { err });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listing to port 8080");
});
