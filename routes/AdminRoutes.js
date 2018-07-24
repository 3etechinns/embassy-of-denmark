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
  /**
   * Make sure these api routes are preceded with a /admin and are wired up with the
   * requireLogin middleware
   */
  app.get("/api/allForms", getAllRequests, (req, res, next) => {
    return res.json(req.allFormRecords);
  });
  app.get("/api/newRequests", getNewRequests, (req, res, next) => {
    return res.json(req.newRequests);
  });
  app.get(
    "/api/underProcessingRequests",
    getProcessingRequests,
    (req, res, next) => {
      return res.json(req.underProcessing);
    }
  );
  app.get("/api/completedRequests", getCompletedRequests, (req, res, next) => {
    return res.json(req.completedRequests);
  });
  app.get(
    "/api/dispatchedRequests",
    getDispatchedRequests,
    (req, res, next) => {
      return res.json(req.dispatchedRequests);
    }
  );

  app.get("/admin", getAllRequests, (req, res, next) => {
    let newRequestsCount = 0;
    let underProcessingRequestsCount = 0;
    let completedRequestsCount = 0;
    let dispatchedRequestsCount = 0;

    req.allFormRecords.forEach(form => {
      if (form.status === PROCESSING_STATUS.newRequests) {
        newRequestsCount++;
      } else if (form.status === PROCESSING_STATUS.completedRequests) {
        completedRequestsCount++;
      } else if (form.status === PROCESSING_STATUS.dispatchedRequests) {
        dispatchedRequestsCount++;
      } else if (form.status === PROCESSING_STATUS.underProcessing) {
        underProcessingRequestsCount++;
      }
    });

    return res.render("admin/home", {
      formRecords: req.allFormRecords,
      newRequestsCount,
      underProcessingRequestsCount,
      completedRequestsCount,
      dispatchedRequestsCount
    });
  });

  app.post("/admin/update/:formId", async (req, res, next) => {
    try {
      const status = getStatus(req.query.as);

      // update where formId === formId and to a status of status
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
      console.log(req.form);
      return res.render("admin/viewPassportForm", { form: req.form._doc });
    } else if (req.query.type === "Visa") {
      return res.render("admin/viewVisaForm", { form: req.form._doc });
    } else {
      const err = new Error("invalid request type");
      return next(err);
    }
  });

  app.get("/admin/embassy_requests", (req, res, next) => {
    return res.redirect("/admin");
  });

  app.get(
    "/admin/transaction/all_requests",
    getAllRequests,
    (req, res, next) => {
      return res.render("admin/transaction", {
        formRecords: req.allFormRecords,
        title: "All Form Records"
      });
    }
  );

  app.get(
    "/admin/transaction/new_requests",
    getNewRequests,
    (req, res, next) => {
      return res.render("admin/transaction", {
        formRecords: req.newRequests,
        title: "New Requests"
      });
    }
  );

  app.get(
    "/admin/transaction/under_processing_requests",
    getProcessingRequests,
    (req, res, next) => {
      return res.render("admin/transaction", {
        formRecords: req.underProcessing,
        title: "Under Processing Requests"
      });
    }
  );

  app.get(
    "/admin/transaction/completed_requests",
    getCompletedRequests,
    (req, res, next) => {
      return res.render("admin/transaction", {
        formRecords: req.completedRequests,
        title: "Completed Requests"
      });
    }
  );

  app.get(
    "/admin/transaction/dispatched_requests",
    getDispatchedRequests,
    (req, res, next) => {
      return res.render("admin/transaction", {
        formRecords: req.dispatchedRequests,
        title: "Dispatched Requests"
      });
    }
  );

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
