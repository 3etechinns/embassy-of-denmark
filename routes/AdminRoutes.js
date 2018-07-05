const path = require("path");
const { getNewRequests, getAllRequests } = require("../middleware/admin");
const { requireLogin } = require("../middleware");
const { formIdParamHandler } = require("../controllers/formsController");

module.exports = app => {
  app.param("formId", formIdParamHandler, (req, res, next) => {
    return res.json(req.form);
  });

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

  app.get("/admin/view/:formId", (req, res, next) => {
    return res.render("viewForm");
  });

  app.get("/admin/support", (req, res, next) => {
    return res.render("admin/support");
  });

  app.get("/admin/embassy_requests", (req, res, next) => {
    return res.render("admin/home");
  });

  app.get("/admin/settings", (req, res, next) => {
    return res.render("admin/home");
  });

  app.post("/admin/support", (req, res, next) => {
    return res.render("admin/support");
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
