const mongoose = require("mongoose");
const { Schema } = mongoose;
const ParentalConsentSchema = require("./ParentalConsent");

const PassportFormSchema = new Schema(
  {
    surname: {
      type: String,
      trim: true,
      required: [true, "surname is required"],
      default: " "
    },
    otherNames: { type: String, trim: true },
    maidenName: { type: String, trim: true },
    previousName: { type: String, trim: true },
    profession: { type: String, trim: true, required: true, default: " " },
    previousProfession: { type: String, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, trim: true, required: true, default: " " },
    placeOfBirth: { type: String, trim: true, required: true, default: " " },
    countryOfResidence: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
    countryOfBirth: { type: String, trim: true, required: true, default: " " },
    height: { type: String, trim: true, required: true, default: " " },
    eyeColor: { type: String, trim: true, required: true, default: " " },
    hairColor: { type: String, trim: true, required: true, default: " " },
    nationality: { type: String, trim: true, required: true, default: " " },
    residentialAddress: {
      type: String,
      trim: true,
      required: [true, "residential address is required"],
      default: " "
    },
    telephoneNumber: { type: String, trim: true, required: true, default: " " },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      default: " "
    },
    fathersName: { type: String, trim: true, required: true, default: " " },
    fathersNationality: {
      type: String,
      trim: true,
      required: [true, "father's nationality is required"],
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
    declarationOption: { type: String },
    oldPassport: { type: Boolean, trim: true },
    dateOfIssue: { type: Date, trim: true },
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
    witnessDate: { type: Date, trim: true, required: true },
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
    interpreterName: { type: String },
    interpreterAddress: { type: String },
    interpreterTelephoneNumber: { type: String },
    languageInterpretedIn: { type: String },
    previousPassportNumber: { type: String },
    declarationDate: { type: Date },
    parentalConsent: { type: ParentalConsentSchema }
    // stateOfPreviousPassport: { type: String },
    // maritalStatus: { type: String, trim: true, required: true, default: " " },
    // firstName: { type: String, trim: true, required: true, default: " " },
    // applicationType: { type: String, trim: true, required: true, default: " " },
    // passportType: { type: String, trim: true, required: true, default: " " },
    // applicationPriority: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   default: " "
    // },
  },
  { timestamps: true }
);

module.exports = PassportFormSchema;
