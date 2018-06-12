module.exports = app => {
  require("./authRoutes")(app);
  require("./formRoutes")(app);
  require("./mainRoutes")(app);
  require("./paymentRoutes")(app);

  // Admin Panel Routes
  require("./AdminRoutes")(app);
};
