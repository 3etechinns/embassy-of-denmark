const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const Payment = mongoose.model("Payment");
const uuid = require("uuid");
const util = require("../util");

const handlePayment = async (req, res, next) => {
  try {
    const charge = await stripe.charges.create({
      amount: 2000,
      currency: "usd",
      description: "pay for passport form",
      source: req.body.token.id
    });

    if (charge.status !== "succeeded") {
      return util.error(
        "sorry, there was an error with your payment process, try again",
        next
      );
    }

    const payment = await Payment.create({
      stripeChargeId: req.body.token.id,
      amount: charge.amount,
      transactionId: uuid(),
      currency: charge.currency,
      _owner: req.session.userId
    });

    req.passportForm.paymentId = payment._id;
    return res.redirect("/profile");
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

module.exports = {
  handlePayment
};
