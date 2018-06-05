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
    dateOfBirth: { type: String, required: true, default: " ", trim: true },
    gender: { type: String, trim: true, required: true, default: " " },
    placeOfBirth: { type: String, trim: true, required: true, default: " " },
    countryOfBirth: { type: String, trim: true, required: true, default: " " },
    height: { type: String, trim: true, required: true, default: " " },
    eyeColor: { type: String, trim: true, required: true, default: " " },
    hairColor: { type: String, trim: true, required: true, default: " " },
    nationality: { type: String, trim: true, required: true, default: " " },
    profession: { type: String },
    countryOfResidence: {
      type: String,
      trim: true,
      required: true,
      default: " "
    },
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
    institution: { type: String },
    placeOfInstitution: { type: String },
    lastYearOfEducation: { type: String },
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
    evidenceOfCitizenshipNumber: { type: String },
    evidenceOfCitizenshipDate: {
      type: String,
      required: true,
      default: " ",
      trim: true
    },
    evidenceOfCitizenshipPlaceOfIssue: { type: String },
    guarantors: {
      type: [
        {
          guarantorsName: {
            type: String,
            trim: true,
            required: true,
            default: " "
          },
          guarantorsAddress: {
            type: String,
            trim: true,
            required: true,
            default: " "
          },
          guarantorsTelephoneNumber: {
            type: String,
            trim: true,
            required: true,
            default: " "
          },
          guarantorsSignature: {
            type: String,
            require: true,
            default: " "
          }
        }
      ],
      required: true
    },
    parentalConsentMetaData: { type: String },
    parentName: { type: String, trim: true },
    parentAddress: { type: String, trim: true },
    parentalConsentSignature: { type: String, trim: true },
    parentTelephoneNumber: { type: String, trim: true },
    languageInterpretedIn: { type: String, trim: true },
    interpreterName: { type: String, trim: true },
    interpreterAddress: { type: String, trim: true },
    interpreterTelephoneNumber: { type: String, trim: true },
    interpretersSignature: { type: String, trim: true },
    interpretationDate: { type: String, trim: true },
    declarationOption: {
      type: String,
      required: true,
      default: " ",
      trim: true
    },
    previousPassportNumber: { type: String, trim: true },
    declarationSignature: { type: String, required: true, default: " " },
    declarationDate: { type: String, required: true, trim: true, default: " " },
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
    witnessSignature: { type: String, trim: true, required: true },
    witnessDate: { type: String, trim: true, required: true, default: " " },
    paymentId: { type: Schema.Types.ObjectId, required: true, default: " " },
    isComplete: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

module.exports = PassportFormSchema;
