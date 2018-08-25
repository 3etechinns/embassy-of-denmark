const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const Payment = mongoose.model("Payment");
const Price = mongoose.model("Price");
const FormRecord = mongoose.model("FormRecord");
const uuid = require("uuid");
const util = require("../util");

const handlePayment = async (req, res, next) => {
  try {
    const [formRecord, price] = await Promise.all([
      FormRecord.findById(req.body.formRecordId),
      Price.findOne()
    ]);

    if (!formRecord) {
      return util.error(
        "form id provided is invalid, payment process terminated",
        next
      );
    }

    let amount;

    switch (formRecord.formType) {
      case "Passport":
        amount = price.current.passportPrice;
        break;
      case "Visa":
        amount = price.current.visaPrice;
        break;
      default:
        amount = 2000;
    }

    amount *= 100;

    const charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      description: "Pay for your form",
      source: req.body.token.id
    });

    console.log(charge);

    if (charge.status !== "succeeded") {
      return util.error(
        "sorry, there was an error with your payment process, try again later",
        next
      );
    }

    const payment = await Payment.create({
      stripeChargeId: req.body.token.id,
      amount: charge.amount,
      transactionId: charge.balance_transaction,
      currency: charge.currency,
      _owner: req.session.userId,
      _formRecordId: req.body.formRecordId
    });

    formRecord.paymentId = payment._id;
    const updatedFormRecord = await formRecord.save();

    console.log(payment);
    console.log(updatedFormRecord);

    return res.redirect("/profile");
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = {
  handlePayment
};
