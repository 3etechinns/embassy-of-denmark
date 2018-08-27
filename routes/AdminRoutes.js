const path = require("path");
const mongoose = require("mongoose");
const Notification = mongoose.model("Notification");
const FormRecord = mongoose.model("FormRecord");
const User = mongoose.model("User");
const Price = mongoose.model("Price");
const Visa = mongoose.model("VisaForm");
const Passport = mongoose.model("PassportForm");
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
const util = require("../util");
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

  app.get("/admin", getAllRequests, async (req, res, next) => {
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

    // Do not include admins
    const users = await User.find({ isAdmin: false });

    return res.render("admin/home", {
      users,
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
      const updatedDoc = await FormRecord.findOneAndUpdate(
        { formId: req.params.formId },
        { status }
      );

      let message = "";

      switch (status) {
        case "Under Processing":
          message = `Your ${updatedDoc.formType} form, ${
            updatedDoc.formCode
          } is under processing. you will be notified upon completion`;
          break;
        case "Completed":
          message = `Your ${updatedDoc.formType} form, ${
            updatedDoc.formCode
          } has been completed and is awaiting dispatch`;
          break;
        case "Dispatched":
          message = `Your ${updatedDoc.formType} form, ${
            updatedDoc.formCode
          } has been dispatched and will be delivered soon`;
          break;
      }

      await Notification.create({
        recipient: updatedDoc._owner,
        title: "Application form status changed",
        message
      });

      return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.post("/admin/verify/:userId", async (req, res, next) => {
    try {
      const status = req.query.verification;

      // update where formId === formId and to a status of status
      const updateMessage = await User.update(
        { _id: req.params.userId },
        { verificationStatus: status }
      );

      let message = "";

      switch (status) {
        case "Verified":
          message =
            "Profile information and attached documents have been verified";
          break;
        case "Under Verification":
          message =
            "Profile information and attached documents are under verification";
          break;
        case "Not Verified":
          message =
            "Profile information and attached documents cannot be verified, please make sure you have provided valid information and documents";
          break;
      }

      await Notification.create({
        recipient: req.params.userId,
        title: "Identity verification",
        message
      });

      return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.get("/admin/view/:formId", async (req, res, next) => {
    // Do not include admins
    const users = await User.find({ isAdmin: false });

    if (req.query.type === "Passport") {
      return res.render("admin/viewPassportForm", { form: req.form, users });
    } else if (req.query.type === "Visa") {
      return res.render("admin/viewVisaForm", { form: req.form, users });
    } else {
      const err = new Error("invalid request type");
      return next(err);
    }
  });

  app.get("/admin/users/:userId/profile", async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return util.error("User not found");
      }
      return res.render("admin/userProfile", { user });
    } catch (error) {
      return next(error);
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

  app.get("/admin/view/:formId/:imageId", requireLogin, (req, res, next) => {
    try {
      const signatureFile = path.resolve(
        __dirname,
        "..",
        "store",
        req.params.imageId
      );
      return res.sendFile(signatureFile);
    } catch (error) {
      error.message =
        "sorry, we are having problems locating the file, try again later";
      return next(error);
    }
  });

  app.get("/admin/settings/pricing", async (req, res, next) => {
    try {
      const prices = await Price.findOne();
      const users = await User.find({ isAdmin: false });
      const applicants = await Promise.all([Passport.count(), Visa.count()]);
      return res.render("admin/pricing", {
        current: prices.current,
        previous: prices.previous,
        applicants,
        users
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/admin/settings/prices", async (req, res, next) => {
    try {
      const prices = await Price.create({
        previous: { ...req.body },
        current: { ...req.body }
      });
      console.log(req.body);
      return res.json(req.body);
      // return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.post("/admin/settings/pricing", async (req, res, next) => {
    try {
      const {
        passportPrice,
        visaPrice,
        dualCitizenshipPrice,
        appointmentPrice,
        previousP,
        previousV,
        previousA,
        previousD
      } = req.body;
      const previous = {
        passportPrice: previousP,
        visaPrice: previousV,
        dualCitizenshipPrice: previousD,
        appointmentPrice: previousA
      };
      const current = {
        passportPrice,
        visaPrice,
        dualCitizenshipPrice,
        appointmentPrice
      };
      const updatedPrices = await Price.update({
        current,
        previous
      });
      return res.redirect("/admin/settings/pricing");
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });

  app.get("/admin/get_price", async (req, res, next) => {
    try {
      if (!req.query.type) {
        const prices = await Price.findOne();
        console.log(prices);
        return res.json(prices);
      }
    } catch (error) {
      return res.json(error);
    }
  });
};
