const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    _owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    stripeChargeId: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    currency: { type: String, required: true },
    _formRecordId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "FormRecord"
    }
  },
  { timestamps: true }
);

module.exports = PaymentSchema;
