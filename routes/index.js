const { requireLogin, requireLogout } = require("../middleware");
const {
  createPassportForm,
  createVisaForm
} = require("../controllers/formsController");
const { createUser, logIn } = require("../controllers/authController");
const {
  getProfile,
  editForm,
  viewForm
} = require("../controllers/mainController");
const mongoose = require("mongoose");
const util = require("../util");
const FORM_TYPES = require("../formsTypes");

const getModelName = type => {
  switch (type) {
    case FORM_TYPES.passportForm:
      return "PassportForm";
    case FORM_TYPES.VisaForm:
      return "VisaForm";
    default:
      return "";
  }
};

module.exports = async app => {
  app.param("formId", async (req, res, next, formId) => {
    try {
      const type = req.query.type;
      const modelName = getModelName(type);

      if (!modelName) {
        return util.error(
          "we are having problems fetching form data, please try again later",
          next
        );
      }

      const form = await mongoose
        .model(modelName)
        .findById(formId)
        .lean()
        .exec();

      if (!form) {
        return util.error("could not load form data, try again later", next);
      }
      req.form = form;
      return next();
    } catch (error) {
      return util.error(error.message, next);
    }
  });

  app.get("/", requireLogout, (req, res, next) => {
    return res.render("register");
  });

  app.get("/login", requireLogout, (req, res, next) => {
    return res.render("login");
  });

  app.get("/register", requireLogout, (req, res, next) => {
    return res.redirect("/");
  });

  app.get("/profile", requireLogin, getProfile);

  app.get("/forms/passport", requireLogin, (req, res, next) => {
    return res.render("passport");
  });

  app.get("/edit/:formId", editForm);

  app.get("/view/:formId", viewForm);

  app.get("/forms/visa", requireLogin, (req, res, next) => {
    return res.render("visaForm");
  });

  app.post("/register", createUser);

  app.post("/login", logIn);

  app.post("/forms/passport", requireLogin, createPassportForm);

  app.post("/forms/visa", requireLogin, createVisaForm);

  app.get("/logout", async (req, res, next) => {
    try {
      await req.session.destroy();
      return res.redirect("/");
    } catch (error) {
      return next(error);
    }
  });
};
