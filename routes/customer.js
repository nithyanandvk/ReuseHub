const express = require("express");
const router = express.Router();
let Customer = require("../models/customer.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const customerController = require("../controllers/customers.js");

router
  .route("/signup")
  .get(customerController.renderSignUpForm)
  .post(wrapAsync(customerController.signup));

router
  .route("/login")
  .get(customerController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    customerController.login
  );

router.get("/logout", customerController.logout);

module.exports = router;
