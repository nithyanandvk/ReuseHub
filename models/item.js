const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FeedBack = require("./feedback.js");

const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  feedbacks: [{ type: Schema.Types.ObjectId, ref: "FeedBack" }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  geometry: {
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
  },
  keywords: {
    type: String,
  },
  phone:String,
});

itemSchema.post("findOneAndDelete", async (item) => {
  if (item) {
    await FeedBack.deleteMany({ _id: { $in: item.feedbacks } });
  }
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
