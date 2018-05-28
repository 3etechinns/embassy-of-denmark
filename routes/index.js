const { requireLogin, requireLogout } = require("../middleware");
const {
  createPassportForm,
  createVisaForm
} = require("../controllers/formsController");
const { createUser, logIn } = require("../controllers/authController");
const mongoose = require("mongoose");
const Form = mongoose.model("Form");

module.exports = app => {
  app.get("/", requireLogout, (req, res, next) => {
    return res.render("register");
  });

  app.get("/profile", requireLogin, async (req, res, next) => {
    const forms = await Form.find({ _owner: req.session.userId });
    return res.render("profile", { forms });
  });

  app.get("/login", requireLogout, (req, res, next) => {
    return res.render("login");
  });

  app.get("/register", requireLogout, (req, res, next) => {
    return res.redirect("/");
  });

  app.get("/logout", async (req, res, next) => {
    try {
      await req.session.destroy();
      return res.redirect("/");
    } catch (error) {
      return next(error);
    }
  });

  app.get("/forms/passport", requireLogin, (req, res, next) => {
    return res.render("passport");
  });

  app.get("/forms/visa", requireLogin, (req, res, next) => {
    return res.render("visaForm");
  });

  app.post("/register", createUser);

  app.post("/login", logIn);

  app.post("/forms/passport", requireLogin, createPassportForm);

  app.post("/forms/visa", requireLogin, createVisaForm);
};
