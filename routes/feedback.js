const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Item = require("../models/item.js");
const FeedBack = require("../models/feedback.js");
const {
  validateFeedBack,
  isLoggedIn,
  isFeedBackAuthor,
} = require("../middleware.js");

const feedbackController = require("../controllers/feedbacks.js");

//FeedBacks
router.post(
  "/",
  isLoggedIn,
  validateFeedBack,
  wrapAsync(feedbackController.createFeedBack)
);

//delete feedback
router.delete(
  "/:feedbackId",
  isLoggedIn,
  isFeedBackAuthor,
  wrapAsync(feedbackController.destroyFeedBack)
);

module.exports = router;
