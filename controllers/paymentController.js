const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const uuid = require("uuid");
const mongoose = require("mongoose");
const Payment = mongoose.model("Payment");
const util = require("../util");

const handlePayment = async (req, res, next) => {
  try {
    const { data, token } = req.body;

    const charge = await stripe.charges.create({
      amount: 2000,
      currency: "usd",
      description: "pay for passport form",
      source: token.id
    });

    if (charge.status !== "succeeded") {
      return util.error(
        "sorry, there was an error with your payment process, try again",
        next
      );
    }

    const payment = await Payment.create({
      stripeChargeId: token.id,
      amount: charge.amount,
      transactionId: uuid(),
      currency: charge.currency,
      _owner: req.session.userId
    });

    return res.json({ token: payment._id });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

module.exports = {
  handlePayment
};
