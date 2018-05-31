const mongoose = require("mongoose");
const { Schema } = mongoose;

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
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = FormSchema;
