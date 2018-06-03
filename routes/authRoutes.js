const { requireLogin, requireLogout } = require("../middleware");
const { createUser, logIn, logout } = require("../controllers/authController");

module.exports = app => {
  app.get("/login", requireLogout, (req, res, next) => {
    return res.render("login");
  });

  app.post("/login", requireLogout, logIn);

  app.get("/register", requireLogout, (req, res, next) => {
    return res.redirect("/");
  });

  app.post("/register", requireLogout, createUser);

  app.get("/logout", requireLogin, logout);
};
