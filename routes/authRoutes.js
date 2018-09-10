const mongoose = require("mongoose");
const { requireLogin, requireLogout } = require("../middleware");
const { createUser, logIn, logout } = require("../controllers/authController");
const util = require("../util");
const User = mongoose.model("User");

module.exports = app => {
  app.get("/signup", (req, res, next) => {
    return res.render("signup");
  });

  app.get("/login", (req, res, next) => {
    return res.render("login");
  });

  app.post("/login", requireLogout, logIn);

  app.post("/create-profile", requireLogout, async (req, res, next) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return res.render("signup", {
        errorMessage: "Please fill all required fields"
      });
    }

    if (password !== confirmPassword) {
      return res.render("signup", {
        errorMessage: "Passwords do not match!"
      });
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.render("signup", {
        errorMessage: "an account with same email already exists!"
      });
    }

    return res.render("createProfile", {
      fullName,
      email,
      password,
      confirmPassword,
      headerText: "Create Profile"
    });
  });

  app.post("/register", requireLogout, createUser);

  app.get("/logout", requireLogin, logout);
};
