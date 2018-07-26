const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true, trim: true },
    nationality: { type: String, required: true, trim: true },
    telephoneNumber: { type: String, required: true, trim: true },
    residentialAddress: { type: String, required: true, trim: true },
    idNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    bankStatement: String,
    residencePermit: String,
    scannedPassport: String,
    verificationStatus: { type: String, default: "Not Verified" },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = UserSchema;
