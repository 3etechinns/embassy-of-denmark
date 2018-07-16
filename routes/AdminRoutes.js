const mongoose = require("mongoose");
const FormRecord = mongoose.model("FormRecord");
const FeedBack = mongoose.model("FeedBack");
const {
  getNewRequests,
  getAllRequests,
  getProcessingRequests,
  getCompletedRequests,
  getDispatchedRequests
} = require("../middleware/admin");
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
    case "Completed":
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
  app.get(
    "/admin",
    getAllRequests,
    getNewRequests,
    getProcessingRequests,
    getCompletedRequests,
    getDispatchedRequests,
    (req, res, next) => {
      // return res.json(req.formRecords);
      return res.render("admin/home", {
        formRecords: req.allFormRecords,
        newRequestsCount: req.newRequests.length,
        underProcessingRequestsCount: req.underProcessing.length,
        completedRequestsCount: req.completedRequests.length,
        dispatchedRequestsCount: req.dispatchedRequests.length
      });
    }
  );

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
    if (req.query.type === "Passport") {
      return res.render("admin/viewPassportForm", { form: req.form._doc });
    } else if (req.query.type === "Visa") {
      return res.render("admin/viewVisaForm", { form: req.form._doc });
    } else {
      const err = new Error("invalid request type");
      return next(err);
    }
  });

  app.get("/admin/embassy_requests", (req, res, next) => {
    return res.render("admin/home");
  });

  app.get("/admin/settings", (req, res, next) => {
    return res.redirect("/admin");
  });

  app.get("/admin/support", (req, res, next) => {
    return res.render("admin/support");
  });

  app.post("/admin/support", async (req, res, next) => {
    try {
      const feedBack = await FeedBack.create({ ...req.body });
      return res.render("admin/support", {
        message: "Thank you for your suggestions"
      });
    } catch (error) {
      return next(error);
    }
  });
};
