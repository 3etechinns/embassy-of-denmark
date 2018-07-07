const mongoose = require("mongoose");
const FormRecord = mongoose.model("FormRecord");
const { getNewRequests, getAllRequests } = require("../middleware/admin");
const { requireLogin } = require("../middleware");
const FORM_TYPES = require("../formsTypes");
const PROCESSING_STATUS = require("../processingStatus");
// const { formIdParamHandler } = require("../controllers/formsController");

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

const getStatus = status => {
  switch (status) {
    case "completed":
      return PROCESSING_STATUS.completedRequests;
    case "Dispatched":
      return PROCESSING_STATUS.dispatchedRequests;
    case "Under Processing":
      return PROCESSING_STATUS.underProcessing;
    default:
      return PROCESSING_STATUS.newRequests;
  }
};

module.exports = app => {
  app.get("/admin", getAllRequests, (req, res, next) => {
    // return res.json(req.formRecords);
    return res.render("admin/home", {
      formRecords: req.formRecords,
      newRequestsCount: req.formRecords.length,
      underProcessingRequestsCount: 0,
      completedRequestsCount: 0,
      dispatchedRequestsCount: 0
    });
  });

  // work on this later
  app.post("/admin/update/:formId", async (req, res, next) => {
    // req.form.update({ ...req.form.update, status: req.query.as });
    // return res.json(req.params);
    try {
      const status = getStatus(req.query.as);
      const updateMessage = await FormRecord.update(
        { formId: req.params.formId },
        { status }
      );

      return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.get("/admin/view/:formId", (req, res, next) => {
    return res.render("admin/viewPassportForm", { form: req.form._doc });
  });

  app.get("/admin/support", (req, res, next) => {
    return res.render("admin/support");
  });

  app.get("/admin/embassy_requests", (req, res, next) => {
    return res.render("admin/home");
  });

  app.get("/admin/settings", (req, res, next) => {
    return res.redirect("/admin");
  });

  app.post("/admin/support", (req, res, next) => {
    return res.render("admin/support", {
      message: "Thank you for your suggestions"
    });
  });

  // app.get("/admin", requireLogin, (req, res, next) => {
  //   const file = path.resolve("public", "admin", "index.html");
  //   return res.sendFile(file);
  // });

  // app.get("/admin/get_form_records", getAllRequests);

  // app.get("/admin/get_new_requests", getNewRequests);

  // app.get("/admin/get_processing_requests", getNewRequests);

  // app.get("/admin/get_completed_requests", getNewRequests);

  // app.get("/admin/get_dispatched_requests", getNewRequests);

  // app.get("/admin/sign-up", (req, res, next) => {
  //   return res.render("admin/signup");
  // });
};
