const mongoose = require("mongoose");
const { Schema } = mongoose;

const referenceSchema = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  telephoneNumber: { type: String, required: true }
});

const visaFormSchema = new Schema(
  {
    surname: { type: String, required: true, trim: true, default: " " },
    firstName: { type: String, required: true, trim: true, default: " " },
    previousName: { type: String },
    placeOfBirth: { type: String, required: true, trim: true, default: " " },
    nationality: { type: String, required: true, trim: true, default: " " },
    email: { type: String, required: true, trim: true, default: " " },
    dateOfBirth: { type: String, required: true, trim: true, default: " " },
    passportNumber: { type: String, required: true, trim: true, default: " " },
    passportDateOfIssue: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    passportDateOfExpiry: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    passportPlaceOfIssue: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    formerNationality: { type: String },
    profession: { type: String, required: true, trim: true, default: " " },
    workPlaceAddress: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    workPlaceTelephoneNumber: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    countryOfCurrentResidence: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    residentialAddress: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    telephoneNumber: { type: String, required: true, trim: true, default: " " },
    intendedDateOfTravelToGhana: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    meansOfTravel: { type: String },
    financialMeansOfApplicant: { type: String },
    possessionOfReturnTicket: { type: Boolean },
    ticketNumber: { type: String },
    dateOfLastVisitToGhana: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    purposeOfJourney: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    visaType: { type: String, required: true, trim: true, default: " " },
    durationOfStayInGhana: {
      type: String,
      required: true,
      trim: true,
      default: " "
    },
    references: { type: [referenceSchema], required: true },
    accompaniedBy: { type: String },
    accompaniedByDateOfBirth: { type: String }
  },
  { timestamps: true }
);

module.exports = visaFormSchema;
