const User = require("../models/user");
const passport = require("passport");

module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, phone, email, password } = req.body;

    // Validate user input (e.g., non-empty username/email/password)
    if (!username || !phone || !email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/signup");
    }

    const newUser = new User({ username, phone, email });

    // Register the user and hash the password
    const registeredUser = await User.register(newUser, password);

    // Automatically log the user in
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Home Away!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
