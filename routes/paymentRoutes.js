const { requireLogin } = require("../middleware");
const { handlePayment } = require("../controllers/paymentController");

module.exports = app => {
  app.post("/forms/payment", requireLogin, handlePayment);
};
