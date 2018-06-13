const { requireLogin, requireLogout } = require("../middleware");
const {
  getProfile,
  accountSettings
} = require("../controllers/mainController");

module.exports = app => {
  app.get("/", requireLogout, (req, res, next) => {
    return res.render("register");
  });

  app.get("/profile", requireLogin, getProfile);

  app.get("/account", requireLogin, accountSettings);
};
