const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    message: { type: String, required: true },
    recipient: { type: Schema.Types.ObjectId, required: true },
    viewed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = NotificationSchema;
