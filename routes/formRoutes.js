const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const Notification = mongoose.model("Notification");
const { requireLogin, handlePayment } = require("../middleware");
const {
  createPassportForm,
  createVisaForm,
  formIdParamHandler,
  editForm,
  updateForm,
  deleteForm,
  createAppointmentForm
} = require("../controllers/formsController");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
  destination: (req, file, cb) => {
    const dir = path.resolve(__dirname, "..", "store");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    cb(null, path.resolve(__dirname, "..", "store"));
  }
});

const upload = multer({
  storage
});

module.exports = app => {
  app.param("formId", formIdParamHandler);

  const cpUpload = upload.fields([
    { name: "guarantorsSignature1", maxCount: 1 },
    { name: "parentalConsentSignature", maxCount: 1 },
    { name: "interpretersSignature", maxCount: 1 },
    { name: "declarationSignature", maxCount: 1 },
    { name: "witnessSignature", maxCount: 1 },
    { name: "guarantorsSignature2", maxCount: 1 }
  ]);

  app.post("/forms/passport", requireLogin, cpUpload, createPassportForm);

  app.post("/forms/visa", requireLogin, createVisaForm);

  app.get("/forms/passport", requireLogin, (req, res, next) => {
    return res.render("passport");
  });

  app.get("/edit/:formId", requireLogin, editForm);

  app.post("/update/:formId", requireLogin, cpUpload, updateForm);

  app.get("/delete/:formRecordId", requireLogin, deleteForm);

  app.get("/forms/visa", requireLogin, (req, res, next) => {
    return res.render("visa");
  });

  app.get("/forms/dual-citizenship", requireLogin, (req, res, next) => {
    return res.json({ message: "work in progress..." });
  });

  app.post("/forms/appointment", requireLogin, createAppointmentForm);

  app.get("/forms/appointment", requireLogin, (req, res, next) => {
    return res.render("appointmentForm");
  });

  app.post(
    "/notifications/:notificationId/mark_as_viewed",
    requireLogin,
    async (req, res, next) => {
      await Notification.updateOne(
        { _id: req.params.notificationId },
        { viewed: true },
        { new: true }
      );

      return res.json({ message: "ok" });
    }
  );

  app.get("/view/:formId/:fileId", requireLogin, (req, res, next) => {
    try {
      const signature = path.resolve(
        __dirname,
        "..",
        "store",
        req.params.fileId
      );
      return res.sendFile(signature);
    } catch (error) {
      error.message =
        "sorry, we are having problems locating the file, try again later";
      return next(error);
    }
  });
};
