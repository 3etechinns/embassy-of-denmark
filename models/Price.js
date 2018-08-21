const mongoose = require("mongoose");
const { Schema } = mongoose;

const PriceSchema = new Schema(
  {
    previous: {
      passportPrice: Number,
      visaPrice: Number,
      dualCitizenshipPrice: Number,
      appointmentPrice: Number
    },
    current: {
      passportPrice: Number,
      visaPrice: Number,
      dualCitizenshipPrice: Number,
      appointmentPrice: Number
    }
  },
  { timestamps: true }
);

module.exports = PriceSchema;
