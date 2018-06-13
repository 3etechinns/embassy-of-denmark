module.exports = app => {
  require("./authRoutes")(app);
  require("./formRoutes")(app);
  require("./mainRoutes")(app);
  require("./paymentRoutes")(app);

  // Admin Routes
  require("./AdminRoutes")(app);
};
