const mongoose = require("mongoose");
const { Schema } = mongoose;

const referenceSchema = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  telephoneNumber: { type: String, required: true }
});

const visaFormSchema = new Schema({
  surname: { type: String, required: true },
  firstName: { type: String, required: true },
  previousName: { type: String },
  nationality: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  passportNumber: { type: String, required: true },
  passportDateOfIssue: { type: Date, required: true },
  passportDateOfExpiry: { type: Date, required: true },
  passportPlaceOfIssue: { type: String, required: true },
  formerNationality: { type: String },
  profession: { type: String, required: true },
  workPlaceAddress: { type: String, required: true },
  workPlaceTelephoneNumber: { type: String, required: true },
  countryOfCurrentResidence: { type: String, required: true },
  residentialAddress: { type: String, required: true },
  telephoneNumber: { type: String, required: true },
  intendedDateOfTravelToGhana: { type: Date, required: true },
  meansOfTravel: { type: String },
  financialMeansOfApplicant: { type: String },
  possessionOfReturnTicket: { type: Boolean },
  ticketNumber: { type: String },
  dateOfLastVisitToGhana: { type: Date, required: true },
  purposeOfJourney: { type: String, required: true },
  visaType: { type: String, required: true },
  durationOfStayInGhana: { type: String, required: true },
  references: { type: [referenceSchema], required: true },
  accompaniedBy: { type: String },
  accompaniedByDateOfBirth: { type: Date }
});

module.exports = visaFormSchema;
