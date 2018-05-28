const mongoose = require("mongoose");
const { Schema } = mongoose;
const ParentalConsentSchema = require("./ParentalConsent");

const PassportFormSchema = new Schema(
  {
    surname: { type: String, trim: true, required: true, default: " " },
    firstName: { type: String, trim: true, required: true, default: " " },
    otherNames: { type: String, trim: true },
    maidenName: { type: String, trim: true },
    previousName: { type: String, trim: true },
    applicationType: { type: String, trim: true, required: true, default: " " },
    passportType: { type: String, trim: true, required: true, default: " " },
    applicationPriority: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    profession: { type: String, trim: true, required: true, default: " " },
    previousProfession: { type: String, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, trim: true, required: true, default: " " },
    placeOfBirth: { type: String, trim: true, required: true, default: " " },
    countryOfBirth: { type: String, trim: true, required: true, default: " " },
    height: { type: String, trim: true, required: true, default: " " },
    eyeColor: { type: String, trim: true, required: true, default: " " },
    hairColor: { type: String, trim: true, required: true, default: " " },
    nationality: { type: String, trim: true, required: true, default: " " },
    maritalStatus: { type: String, trim: true, required: true, default: " " },
    residentialAddress: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    telephoneNumber: { type: String, trim: true, required: true, default: " " },
    email: { type: String, trim: true, required: true, default: " " },
    fathersName: { type: String, trim: true, required: true, default: " " },
    fathersNationality: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    fathersAddress: { type: String, trim: true, required: true, default: " " },
    mothersName: { type: String, trim: true, required: true, default: " " },
    mothersNationality: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    mothersAddress: { type: String, trim: true, required: true, default: " " },
    oldPassport: { type: Boolean, trim: true },
    dateOfIssue: { type: Date },
    placeOfIssue: { type: String, trim: true },
    witnessName: { type: String, trim: true, required: true, default: " " },
    witnessOccupation: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    witnessWorkPlaceAddress: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    witnessTelephoneNumber: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    witnessResidentialAddress: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    witnessDate: { type: Date, required: true },
    guarantors: {
      type: [
        {
          guarantorsName: {
            type: String,
            trim: true,
            required: true,
            default: " "
          },
          guarantorsAddress: { type: String, trim: true },
          guarantorsTelephoneNumber: { type: String, trim: true }
        }
      ],
      required: true
    },
    parentalConsent: { type: ParentalConsentSchema }
  },
  { timestamps: true }
);

module.exports = PassportFormSchema;
