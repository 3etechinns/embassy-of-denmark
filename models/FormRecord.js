const mongoose = require("mongoose");
const { Schema } = mongoose;
const { newRequests } = require("../processingStatus");

const FormRecordSchema = new Schema(
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
    },
    formCode: { type: String, required: true },
    assignedStaff: { type: Schema.Types.ObjectId, ref: "Personnel" }
  },
  { timestamps: true }
);

module.exports = FormRecordSchema;
