const mongoose = require("mongoose");
const { Schema } = mongoose;
const { newRequests } = require("../processingStatus");

const FormSchema = new Schema(
  {
    _owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    formId: { type: Schema.Types.ObjectId, required: true },
    formType: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: newRequests
    },
    isComplete: { type: Boolean, required: true, default: false },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment"
    }
  },
  { timestamps: true }
);

module.exports = FormSchema;
