const { requireLogin } = require("../middleware");
const {
  createPassportForm,
  createVisaForm,
  formIdParamHandler,
  editForm,
  viewForm
} = require("../controllers/formsController");

module.exports = app => {
  app.param("formId", formIdParamHandler);

  app.post("/forms/passport", requireLogin, createPassportForm);

  app.post("/forms/visa", requireLogin, createVisaForm);

  app.get("/forms/passport", requireLogin, (req, res, next) => {
    return res.render("passport");
  });

  app.get("/edit/:formId", requireLogin, editForm);

  app.get("/view/:formId", requireLogin, viewForm);

  app.get("/forms/visa", requireLogin, (req, res, next) => {
    return res.render("visaForm");
  });
};