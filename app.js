if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
//console.log(process.env.SECRET);

const express = require("express");
const app = express();
const port = 3000;

const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Customer = require("./models/customer.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const itemRouter = require("./routes/item.js");
const feedbackRouter = require("./routes/feedback.js");
const customerRouter = require("./routes/customer.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/reusehub";
const dbUrl = process.env.ATLASDB_URL;
// const dbUrl = MONGO_URL;

const ejsMate = require("ejs-mate");
const Item = require("./models/item.js");
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //2024-07-10T18:05:18.759Z
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Customer.authenticate()));

passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/registercustomer",async(req,res)=>{
//   let fakeCustomer=new Customer({
//     email:"student@gmail.com",
//     username:"delta-student"
//   });
//   let registeredCustomer=await Customer.register(fakeCustomer,"helloworld");
//   res.send(registeredCustomer);
// });

app.use("/items", itemRouter);
app.use("/items/:id/feedbacks", feedbackRouter);
app.use("/", customerRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  console.log(message);
  //res.status(statusCode).render("error.ejs", { message });
  res.status(statusCode).send(err);
});

app.listen(port, () => {
  console.log(`listening on port number ${port}`);
});
