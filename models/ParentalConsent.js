const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParentalConsentSchema = new Schema({
  streetName: { type: String },
  streetNumber: { type: String },
  postCode: { type: String },
  city: { type: String },
  country: { type: String },
  telephoneNumber: { type: String },
  email: { type: String },
  nameofChild: { type: String },
  dateOfBirth: { type: String },
  placeOfBirth: { type: String },
  nameOfParent: { type: String },
  ghanaianPassportNumber: { type: String },
  dateofIssue: { type: Date },
  placeOfIssue: { type: String },
  countryOfIssue: { type: String },
  fathersName: { type: String },
  mothersName: { type: String }
});

module.exports = ParentalConsentSchema;
