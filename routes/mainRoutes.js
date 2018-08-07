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

  app.get("/history", requireLogin, getProfile);

  app.get("/profile", requireLogin, accountSettings);

  app.post("/profile", requireLogin, updateAccountDetails);
};
