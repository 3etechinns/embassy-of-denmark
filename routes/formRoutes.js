const { requireLogin, handlePayment } = require("../middleware");
const {
  createPassportForm,
  createVisaForm,
  formIdParamHandler,
  editForm,
  updateForm,
  deleteForm
} = require("../controllers/formsController");

module.exports = app => {
  app.param("formId", formIdParamHandler);

  app.post("/forms/passport", requireLogin, createPassportForm);

  app.post("/forms/visa", requireLogin, createVisaForm);

  app.get("/forms/passport", requireLogin, (req, res, next) => {
    return res.render("passport");
  });

  app.get("/edit/:formId", requireLogin, editForm);

  app.post("/update/:formId", requireLogin, updateForm);

  app.get("/delete/:formRecordId", requireLogin, deleteForm);

  app.get("/forms/visa", requireLogin, (req, res, next) => {
    return res.render("visaForm");
  });

  app.get("/forms/dual-citizenship", requireLogin, (req, res, next) => {
    return res.json({ message: "work in progress..." });
  });

  app.get("/forms/appointment", requireLogin, (req, res, next) => {
    return res.json({ message: "work in progress..." });
  });
};
