const Customer = require("../models/customer.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("customers/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newCustomer = new Customer({ email, username });
    const registeredCustomer = await Customer.register(newCustomer, password);
    console.log(registeredCustomer);
    req.login(registeredCustomer, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Reuse Hub");
      res.redirect("/items");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("customers/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Reuse Hub! you are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/items";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/items");
  });
};
