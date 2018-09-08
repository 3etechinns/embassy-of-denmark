const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    title: { type: String },
    message: { type: String, required: true },
    recipient: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    viewed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = NotificationSchema;
