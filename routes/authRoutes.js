const { requireLogin, requireLogout } = require("../middleware");
const { createUser, logIn, logout } = require("../controllers/authController");
const util = require("../util");

module.exports = app => {
  app.get("/login", requireLogout, (req, res, next) => {
    return res.render("login");
  });

  app.post("/login", requireLogout, logIn);

  app.post("/create-profile", requireLogout, (req, res, next) => {
    const { fullName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      res.locals.errorMessage = "Passwords do not match!";
    }
    return res.render("createProfile", {
      fullName,
      email,
      password,
      confirmPassword
    });
  });

  app.post("/register", requireLogout, createUser);

  app.get("/logout", requireLogin, logout);
};
