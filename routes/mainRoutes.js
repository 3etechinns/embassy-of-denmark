const { requireLogin, requireLogout } = require("../middleware");
const {
  getProfile,
  accountSettings,
  updateAccountDetails
} = require("../controllers/mainController");

module.exports = app => {
  app.get("/", (req, res, next) => {
    return res.render("landing");
  });

  app.get("/profile", requireLogin, getProfile);

  app.get("/account", requireLogin, accountSettings);

  app.post("/account", requireLogin, updateAccountDetails);
};
