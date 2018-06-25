const path = require("path");
const {
  getNewRequests,
  getAllRequests
} = require("../controllers/adminController");
const { requireLogin } = require("../middleware");

module.exports = app => {
  app.get("/admin", requireLogin, (req, res, next) => {
    const file = path.resolve("public", "admin", "index.html");
    return res.sendFile(file);
  });

  app.get("/admin/get_form_records", getAllRequests);

  app.get("/admin/get_new_requests", getNewRequests);

  app.get("/admin/get_processing_requests", getNewRequests);

  app.get("/admin/get_completed_requests", getNewRequests);

  app.get("/admin/get_dispatched_requests", getNewRequests);

  app.get("/admin/sign-up", (req, res, next) => {
    return res.render("admin/signup");
  });
};
