const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Item = require("../models/item.js");
const { isLoggedIn, isOwner, validateItem } = require("../middleware.js");
const itemController = require("../controllers/items.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index route //create route

router
  .route("/")
  .get(wrapAsync(itemController.index))
  .post(
    isLoggedIn,
    upload.single("item[image]"),
    validateItem,
    wrapAsync(itemController.createItem)
  );

//new route
router.get("/new", isLoggedIn, itemController.renderNewForm);

//Show route //update route //delete Route

router.get("/search", wrapAsync(itemController.search));

router
  .route("/:id")
  .get(wrapAsync(itemController.showItem))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("item[image]"),
    validateItem,
    wrapAsync(itemController.updateItem)
  )
  .delete(isOwner, isLoggedIn, wrapAsync(itemController.destroyItem));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(itemController.renderEditForm)
);

router.get("/filter/:category", itemController.filter);

module.exports = router;
