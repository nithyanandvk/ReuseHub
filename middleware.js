const Item = require("./models/item");
const FeedBack = require("./models/feedback");
const { itemSchema, feedbackSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create a item!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let item = await Item.findById(id);
  if (!item.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this item");
    return res.redirect(`/items/${id}`);
  }
  next();
};

module.exports.validateItem = (req, res, next) => {
  let { error } = itemSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateFeedBack = (req, res, next) => {
  let { error } = feedbackSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isFeedBackAuthor = async (req, res, next) => {
  let { id, feedbackId } = req.params;
  let feedback = await FeedBack.findById(feedbackId);
  if (!feedback.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this feedback");
    return res.redirect(`/items/${id}`);
  }
  next();
};
