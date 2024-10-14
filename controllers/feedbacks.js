const FeedBack = require("../models/feedback.js");
const Item = require("../models/item.js");

module.exports.createFeedBack = async (req, res) => {
  let item = await Item.findById(req.params.id);
  let newFeedBack = new FeedBack(req.body.feedback);
  item.feedbacks.push(newFeedBack);
  newFeedBack.author = req.user._id;
  //console.log(newFeedBack);
  await newFeedBack.save();
  await item.save();
  console.log("new feedback saved");
  req.flash("success", "New FeedBack Created");
  res.redirect(`/items/${item.id}`);
};

module.exports.destroyFeedBack = async (req, res) => {
  let { id, feedbackId } = req.params;
  await Item.findByIdAndUpdate(id, { $pull: { feedbacks: feedbackId } });
  await FeedBack.findByIdAndDelete(feedbackId);
  req.flash("success", "FeedBack Deleted");
  res.redirect(`/items/${id}`);
};