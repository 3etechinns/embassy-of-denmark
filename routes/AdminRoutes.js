const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Notification = mongoose.model("Notification");
const FormRecord = mongoose.model("FormRecord");
const User = mongoose.model("User");
const Price = mongoose.model("Price");
const Personnel = mongoose.model("Personnel");
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
const { requireLogin, requireLogout } = require("../middleware/admin");
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
    case FORM_TYPES.appointment:
      return "AppointmentForm";
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

  app.get("/admin/signup", requireLogout, (req, res, next) => {
    return res.render("admin/adminSignup");
  });

  app.post("/admin/signup", async (req, res, next) => {
    try {
      const { last, first, email, password, confirmPassword } = req.body;

      if (
        (!last.trim() || !first.trim() || !email.trim() || !password.trim(),
        !confirmPassword.trim())
      ) {
        return res.render("admin/adminSignup", {
          errorMessage: "All fields are required"
        });
      }

      if (password !== confirmPassword) {
        return res.render("admin/adminSignup", {
          errorMessage: "Passwords do not match"
        });
      }

      const hash = await bcrypt.hash(password, 10);
      const admin = await Personnel.create({
        email,
        fullName: { last, first },
        password: hash,
        isAdmin: true
      });

      req.session.userId = admin._id;
      req.session.isAdmin = admin.isAdmin;
      req.session.isStaff = true;

      return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.get("/admin/add-staff", requireLogin, (req, res, next) => {
    return res.render("admin/addStaff");
  });

  app.post("/admin/add-staff", async (req, res, next) => {
    try {
      const { first, last, email, password } = req.body;

      const existingStaff = await Personnel.findOne({ email });

      if (existingStaff) {
        return res.render("admin/addStaff", {
          errorMessage: "A staff exists with same email"
        });
      }

      await Personnel.create({
        email,
        fullName: { last, first },
        password
      });

      return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.get("/staff/signin", requireLogout, (req, res, next) => {
    return res.render("admin/staffSignin");
  });

  app.post("/staff/signin", requireLogout, async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const staff = await Personnel.findOne({ email });

      if (!staff) {
        return res.render("admin/staffSignin", {
          errorMessage: "No account exists with this email"
        });
      }

      const matching = await bcrypt.compare(password, staff.password);

      if (!matching) {
        return util.error("Incorrect Password", next, 403);
      }

      req.session.userId = staff._id;
      req.session.isStaff = true;
      req.session.isAdmin = staff.isAdmin;
      return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.get("/admin/staff", requireLogin, async (req, res, next) => {
    try {
      const allStaff = await Personnel.find();

      return res.render("admin/staff", { allStaff, title: "Staff Log" });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/allForms", requireLogin, getAllRequests, (req, res, next) => {
    return res.json(req.allFormRecords);
  });
  app.get(
    "/api/newRequests",
    requireLogin,
    getNewRequests,
    (req, res, next) => {
      return res.json(req.newRequests);
    }
  );
  app.get(
    "/api/underProcessingRequests",
    requireLogin,
    getProcessingRequests,
    (req, res, next) => {
      return res.json(req.underProcessing);
    }
  );
  app.get(
    "/api/completedRequests",
    requireLogin,
    getCompletedRequests,
    (req, res, next) => {
      return res.json(req.completedRequests);
    }
  );
  app.get(
    "/api/dispatchedRequests",
    requireLogin,
    getDispatchedRequests,
    (req, res, next) => {
      return res.json(req.dispatchedRequests);
    }
  );

  app.get("/admin", requireLogin, getAllRequests, async (req, res, next) => {
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

  app.post("/admin/update/:formId", requireLogin, async (req, res, next) => {
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
        case "Completed Request":
          message = `Your ${updatedDoc.formType} form, ${
            updatedDoc.formCode
          } has been completed and is awaiting dispatch`;
          break;
        case "Dispatched Request":
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

  app.post("/admin/verify/:userId", requireLogin, async (req, res, next) => {
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

  app.get("/admin/view/:formId", requireLogin, async (req, res, next) => {
    // Do not include admins
    const users = await User.find({ isAdmin: false });

    if (req.query.type === "Passport") {
      return res.render("admin/viewPassportForm", { form: req.form, users });
    } else if (req.query.type === "Visa") {
      return res.render("admin/viewVisaForm", { form: req.form, users });
    } else if (req.query.type === "Appointment") {
      return res.render("admin/viewAppointmentForm", { form: req.form, users });
    } else {
      const err = new Error("invalid request type");
      return next(err);
    }
  });

  app.get(
    "/admin/users/:userId/profile",
    requireLogin,
    async (req, res, next) => {
      try {
        const user = await User.findById(req.params.userId);
        if (!user) {
          return util.error("User not found");
        }
        return res.render("admin/userProfile", { user });
      } catch (error) {
        return next(error);
      }
    }
  );

  app.get("/admin/embassy_requests", requireLogin, (req, res, next) => {
    return res.redirect("/admin");
  });

  app.get(
    "/admin/transaction/all_requests",
    requireLogin,
    getAllRequests,
    async (req, res, next) => {
      try {
        const allStaff = await Personnel.find({}, { fullName: true });

        console.log(req.allFormRecords);
        return res.render("admin/transaction", {
          formRecords: req.allFormRecords,
          allStaff,
          title: "All Form Records"
        });
      } catch (error) {
        return next(error);
      }
    }
  );

  app.get(
    "/admin/transaction/new_requests",
    requireLogin,
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
    requireLogin,
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
    requireLogin,
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
    requireLogin,
    getDispatchedRequests,
    (req, res, next) => {
      return res.render("admin/transaction", {
        formRecords: req.dispatchedRequests,
        title: "Dispatched Requests"
      });
    }
  );

  app.get("/admin/settings", requireLogin, (req, res, next) => {
    return res.redirect("/admin");
  });

  app.get("/admin/support", requireLogin, (req, res, next) => {
    return res.render("admin/support");
  });

  app.post("/admin/support", requireLogin, async (req, res, next) => {
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

  app.get("/admin/settings/pricing", requireLogin, async (req, res, next) => {
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
      return res.json(req.body);
      // return res.redirect("/admin");
    } catch (error) {
      return next(error);
    }
  });

  app.post("/admin/settings/pricing", requireLogin, async (req, res, next) => {
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
      return next(error);
    }
  });

  app.get("/admin/get_price", requireLogin, async (req, res, next) => {
    try {
      if (!req.query.type) {
        const prices = await Price.findOne();
        return res.json(prices);
      }
    } catch (error) {
      return res.json(error);
    }
  });

  app.post("/admin/forms/assign", requireLogin, async (req, res, next) => {
    const { assignedStaff, forms } = req.body;
    console.log(req.body);

    await Promise.all([
      Personnel.updateOne({ _id: assignedStaff }, { assignments: forms }),
      FormRecord.updateMany({ _id: { $in: forms } }, { assignedStaff })
    ]);
    return res.redirect("/admin/transaction/all_requests");
  });
};
