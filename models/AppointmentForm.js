const mongoose = require("mongoose");
const { Schema } = mongoose;

const AppointmentFormSchema = new Schema({
  surname: { type: String, required: true },
  otherNames: { type: String, required: true },
  nationality: { type: String, required: true },
  formerNationality: { type: String },
  countryOfResidence: { type: String, required: true },
  residentialAddress: { type: String, required: true },
  occupation: { type: String, required: true },
  telephoneNumber: { type: String, required: true },
  reasonOfAppointment: { type: String, required: true },
  preferredDateOfAppointment: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = AppointmentFormSchema;
