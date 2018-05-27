const mongoose = require("mongoose");
const { Schema } = mongoose;

const witnessFormSchema = new Schema({
  witnessName: { type: String, required: true },
  witnessOccupation: { type: String, required: true },
  witnessWorkPlaceAddress: { type: String, required: true },
  witnessTelephoneNumber: { type: String, required: true },
  witnessResidentialAddress: { type: String, required: true },
  witnessDate: { type: Date, required: true }
});

const GuarantorSchema = new Schema({
  guarantorsName: { type: String, required: true },
  guarantorsAddress: { type: String },
  guarantorsTelephoneNumber: { type: String }
});

module.exports = { witnessFormSchema, GuarantorSchema };
