module.exports = app => {
  require("./authRoutes")(app);
  require("./formRoutes")(app);
  require("./mainRoutes")(app);
  require("./paymentRoutes")(app);
};
