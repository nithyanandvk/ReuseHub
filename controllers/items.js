const Item = require("../models/item.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allItems = await Item.find({});
  res.render("items/index.ejs", { allItems });
};

module.exports.renderNewForm = (req, res) => {
  res.render("items/new.ejs");
};

module.exports.showItem = async (req, res) => {
  let { id } = req.params;
  const item = await Item.findById(id)
    .populate({
      path: "feedbacks",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!item) {
    req.flash("error", "Item you requested for does not exist");
    res.redirect("/items");
  }
  //console.log(item);
  res.render("items/show.ejs", { item });
};

module.exports.createItem = async (req, res, next) => {
  // console.log(req.user);
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);
  const newItem = new Item(req.body.item);
  newItem.owner = req.user._id;
  newItem.image = { url, filename };
  // console.log(newItem.location);
  const address = newItem.location;
  let key = process.env.MAP_API;
  const response = await axios.get(
    `https://geocode.maps.co/search?q=${address}&api_key=${key}`
  );
  console.log("latitude:", response.data[0].lat);
  console.log("longitude:", response.data[0].lon);
  newItem.geometry.coordinates[0] = response.data[0].lat;
  newItem.geometry.coordinates[1] = response.data[0].lon;
  await newItem.save();
  req.flash("success", "New Item Created");
  res.redirect("/items");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const item = await Item.findById(id);
  if (!item) {
    req.flash("error", "Item you requested for does not exist");
    res.redirect("/items");
  }
  let originalImageUrl = item.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("items/edit.ejs", { item, originalImageUrl });
};

module.exports.updateItem = async (req, res) => {
  let { id } = req.params;
  let item = await Item.findByIdAndUpdate(id, { ...req.body.item });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    item.image = { url, filename };
    await item.save();
  }
  const address = req.body.item.location;
  // console.log(req.body.item.location);
  let key = process.env.MAP_API;
  const response = await axios.get(
    `https://geocode.maps.co/search?q=${address}&api_key=${key}`
  );
  console.log("latitude:", response.data[0].lat);
  console.log("longitude:", response.data[0].lon);
  item.geometry.coordinates[0] = response.data[0].lat;
  item.geometry.coordinates[1] = response.data[0].lon;
  await item.save();

  req.flash("success", "Item Updated");
  res.redirect(`/items/${id}`);
};

module.exports.destroyItem = async (req, res) => {
  let { id } = req.params;
  let deletedItem = await Item.findByIdAndDelete(id);
  console.log(deletedItem);
  req.flash("success", "Item Deleted");
  res.redirect("/items");
};

module.exports.search = async (req, res) => {
  let search = req.query.search;
  console.log(search);
  search = search.toLowerCase();
  let allItems = await Item.find({ category: search });
  if (allItems.length === 0) {
    req.flash("error", "No such results found!");
    return res.redirect("/items");
  }
  res.render("items/index.ejs", { allItems });
};

module.exports.filter = async (req, res) => {
  let { category } = req.params;
  console.log(category);
  category = category.toLowerCase();
  let allItems = await Item.find({ category: category });
  if (allItems.length === 0) {
    req.flash("error", "No such results found!");
    return res.redirect("/items");
  }
  res.render("items/index.ejs", { allItems });
};
