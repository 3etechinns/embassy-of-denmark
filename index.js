const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("./models");
const pug = require("pug");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const Notification = mongoose.model("Notification");

// Only used in development mode to set environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// mongodb://127.0.0.1:27017/denmarkdb

const app = express();

// Configuration settings on the app
app.set("view engine", "pug");
app.set("views", "templates");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 60 * 60 * 24 * 1000 }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));
mongoose.connect(
  process.env.MONGO_URI,
  { autoReconnect: true },
  err => {
    if (err) return console.log("Database connection error");
    return console.log("Database connected successfully");
  }
);

app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const notifications = await Notification.find({
        recipient: req.session.userId
      }).lean();

      let unViewedNotifications = notifications.filter(
        notification => !notification.viewed
      ).length;

      res.locals = {
        userId: req.session.userId,
        email: req.session.userEmail,
        fullName: req.session.fullName,
        notifications,
        unViewedNotifications
      };
    } catch (error) {
      return next(error);
    }
  }
  return next();
});

const { requireLogin } = require("./middleware/admin");

/**
 * MUST NEVER BE COMMENTED OUT IN PRODUCTION
 */
// app.use("/admin", requireLogin);

// route Handler
require("./routes")(app);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Sorry, the page you requested for can't be found");
  error.status = 404;
  return next(error);
});

// Error Handler
app.use((error, req, res, next) => {
  return res.status(error.status || 500).render("error", { error });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
