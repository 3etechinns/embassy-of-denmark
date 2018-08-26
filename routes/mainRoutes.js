const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { requireLogin, requireLogout } = require("../middleware");
const {
  getProfile,
  accountSettings,
  updateAccountDetails,
  viewFile
} = require("../controllers/mainController");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
  destination: (req, file, cb) => {
    const dir = path.resolve(__dirname, "..", "store");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
    }
    cb(null, path.resolve(__dirname, "..", "store"));
  }
});

const upload = multer({
  storage
});

module.exports = app => {
  const cpUpload = upload.fields([
    { name: "bankStatement", maxCount: 1 },
    { name: "residencePermit", maxCount: 1 },
    { name: "scannedPassport", maxCount: 1 }
  ]);

  app.get("/", (req, res, next) => {
    return res.render("landing");
  });

  app.get("/history", requireLogin, getProfile);

  app.get("/profile", requireLogin, accountSettings);

  app.get("/me/view/files/:fileId", requireLogin, viewFile);

  app.post("/profile", requireLogin, cpUpload, updateAccountDetails);
};
