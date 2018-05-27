const mongoose = require("mongoose");
const { Schema } = mongoose;

const evidenceOfCitizenshipFormSchema = new Schema({
  fathersName: { type: String, required: true },
  fathersNationality: { type: String, required: true },
  fathersAddress: { type: String, required: true },
  mothersName: { type: String, required: true },
  mothersNationality: { type: String, required: true },
  mothersAdrress: { type: String, required: true },
  oldPassport: { type: Boolean },
  dateofIssue: { type: Date },
  placeOfIssue: { type: String }
});

module.exports = evidenceOfCitizenshipFormSchema;
