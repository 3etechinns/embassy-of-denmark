const mongoose = require("mongoose");
const { Schema } = mongoose;
const ParentalConsentSchema = require("./ParentalConsent");
const { witnessFormSchema, GuarantorSchema } = require("./Witness");
const evidenceOfCitizenShipFormSchema = require("./evidenceOfCitizenShip");

const PassportFormSchema = new Schema(
  {
    surname: { type: String, required: true },
    firstName: { type: String, required: true },
    otherNames: { type: String },
    maidenName: { type: String },
    previousName: { type: String },
    applicationType: { type: String, required: true },
    passportType: { type: String, required: true },
    applicationPriority: { type: String, required: true },
    profession: { type: String, required: true },
    previousProfession: { type: String },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    countryOfBirth: { type: String, required: true },
    height: { type: String, required: true },
    eyeColor: { type: String, required: true },
    hairColor: { type: String, required: true },
    nationality: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    residentialAddress: { type: String, required: true },
    telephoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    guarantors: { type: [GuarantorSchema], required: true },
    evidenceOfCitizenship: {
      type: evidenceOfCitizenShipFormSchema,
      required: true
    },
    witness: { type: witnessFormSchema, required: true },
    parentalConsent: { type: ParentalConsentSchema }
  },
  { timestamps: true }
);

module.exports = PassportFormSchema;
