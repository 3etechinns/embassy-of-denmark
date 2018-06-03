const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    _owner: { type: Schema.Types.ObjectId, required: true },
    stripeChargeId: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    currency: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = PaymentSchema;
